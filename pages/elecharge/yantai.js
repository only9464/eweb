var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = require("../../utils/throttle.js"),
  n = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    roomid: "",
    roomname: "",
    degreeIndex: 0,
    areaid: "",
    elcsysid: "",
    elecode: "",
    buildid: "",
    amount: "",
    pwd: "",
    billno: "",
    restElecDegree: "",
    status: !1,
    array: [{
      bankname: "卡余额充值"
    }],
    index: 0,
    remark: "",
    isWaterSystem: !1,
    enterType: "number",
    appid: "",
    rest: ""
  },
  onLoad: function(t) {
    var e = this,
      o = wx.getStorageSync("funcPart"),
      i = {};
    o.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "elecQueryYt" == t.id && (i = t)
      }))
    })), wx.setNavigationBarTitle({
      title: n.t(i.id, {
        value: "en-US" != e.data.$_locale ? i.title : i.entitle
      })
    });
    var r = wx.getAccountInfoSync().miniProgram.appId;
    if (e.setData({
        isWaterSystem: !1,
        rest: "剩余电量(度)"
      }), a.$isEmpty(wx.getStorageSync("isBindEleroom"))) {
      var s = JSON.parse(wx.getStorageSync("roomData"));
      return wx.$isEmpty(s) ? void wx.showModal({
        title: "错误",
        content: "获取电控房间信息失败",
        showCancel: !1
      }) : (e.setData({
        roomid: s.roomId,
        roomname: s.roomName,
        areaid: s.areaId,
        buildid: s.buiId,
        elcsysid: s.elcsysid,
        restElecDegree: s.restElecDegree,
        remark: wx.getStorageSync("remark") || "",
        appid: r
      }), void e.getCanUseBank())
    }
    var d = JSON.parse(wx.getStorageSync("isBindEleroom"));
    a.$requestSync("POST", "/miniprogram/queryroominfo", d, (function(t, a) {
      0 == a.retcode && e.setData({
        roomid: a.data.roomId,
        roomname: a.data.roomName,
        areaid: a.data.areaId,
        buildid: a.data.buiId,
        elcsysid: a.data.elcsysid,
        restElecDegree: a.data.restElecDegree,
        remark: wx.getStorageSync("remark") || "",
        appid: r
      })
    })), e.getCanUseBank()
  },
  getCanUseBank: function() {
    var t = this;
    a.$requestSync("POST", "/miniprogram/getbanks", {}, (function(a, e) {
      if (0 == e.retcode) {
        var n = e.data.data ? e.data.data : [],
          o = t.data.array;
        n.length && n.forEach((function(t) {
          t.payflag && o.push(t)
        })), t.setData({
          array: o
        })
      }
    }))
  },
  setAmount: function(t) {
    this.setData({
      amount: t.detail.value
    })
  },
  bindDegree: function(t) {
    this.setData({
      degreeIndex: t.detail.value
    })
  },
  backtoEle: function() {
    wx.removeStorageSync("isBindEleroom"), wx.reLaunch({
      url: "/pages/elecQuery/yantai"
    })
  },
  doNext: e.throttle((function(t) {
    var e = this,
      n = this.data;
    if (!a.$isDot(n.amount) && "wx77c30a197a76fa27" != n.appid) return wx.showModal({
      title: "错误",
      content: "充值金额不能含有小数点",
      showCancel: !1
    }), !1;
    var o = {
      elcsysid: n.elcsysid || 0,
      areaid: n.areaid || 0,
      roomid: n.roomid || 0,
      buildid: n.buildid || 0,
      roomname: "".concat(n.remark).concat(n.isWaterSystem ? "水" : "电", "量：").concat(n.restElecDegree).concat(n.isWaterSystem ? "吨" : "度"),
      amount: parseInt(100 * parseFloat(n.amount) + .5)
    };
    a.$requestSync("POST", "/miniprogram/buyelectrityinit", o, (function(t, a) {
      0 == a.retcode && (e.setData({
        billno: a.data.billno
      }), 0 == n.index ? e.rechargeInit() : "wxPay" == n.array[n.index].bankcode && e.wxpay(a.data.billno))
    }))
  }), 5e3),
  close: function() {
    this.setData({
      status: !1
    })
  },
  wxpay: function(t) {
    var e = this.data.amount,
      n = Number(e),
      o = {
        amount: parseInt(100 * parseFloat(n) + .5),
        paymethod: "",
        billno: t
      };
    a.$requestSync("POST", "/miniprogram/wechatcharge", o, (function(t, e) {
      0 == e.retcode && (wx.showLoading({
        title: "请求中",
        mask: !0
      }), wx.requestPayment({
        timeStamp: e.data.timeStamp,
        nonceStr: e.data.nonceStr,
        package: e.data.packageValue,
        signType: "MD5",
        paySign: e.data.sign,
        success: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          }), a.$showModal("提示", "充值成功", "回首页")
        },
        fail: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          }), wx.showModal({
            title: "错误",
            content: "充值失败",
            showCancel: !1,
            success: function(t) {}
          })
        }
      }))
    }))
  },
  rechargeInit: function() {
    var t = this,
      e = {
        elcsysid: t.data.elcsysid || 0,
        areaid: t.data.areaid || 0,
        roomid: t.data.roomid || 0,
        buildid: t.data.buildid || 0,
        roomname: t.data.roomname,
        amount: parseInt(100 * parseFloat(t.data.amount) + .5),
        pwd: t.data.pwd ? t.data.pwd : "",
        billno: t.data.billno
      };
    a.$requestSync("POST", "/miniprogram/balancepay", e, (function(e, n) {
      wx.hideLoading({
        complete: function(t) {}
      }), e ? 0 == n.data.retcode ? a.$payRequestSync("POST", "/miniprogram/queryelecresult", {
        billno: t.data.billno
      }, (function(e, n) {
        if (e)
          if (200 === n.statusCode) {
            if (0 == n.data.retcode) {
              var o = n.data.data;
              2 == o.billstatus ? a.$showModal("提示", "充值成功", "回首页") : 2 != o.billstatus && 1 != o.billstatus ? a.$showModal("提示", "充值失败", "回首页") : 1 == n.data.retcode && t.confirm()
            }
          } else wx.showModal({
            title: "错误",
            content: "后台错误 " + n.statusCode,
            confirmText: "确定",
            showCancel: !1,
            duration: 4e3,
            success: function(t) {}
          });
        else wx.showModal({
          title: "错误",
          content: "后台错误 " + n.statusCode,
          confirmText: "确定",
          showCancel: !1,
          duration: 4e3,
          success: function(t) {}
        })
      })) : 77 == n.data.retcode && t.setData({
        status: !0
      }) : t.setData({
        pwd: ""
      })
    }))
  },
  confirm: function() {
    wx.showLoading({
      title: "请求中",
      mask: !0
    }), clearInterval(that.data.setInter), that.setData({
      setInter: null
    });
    var t = 0;
    that.data.setInter = setInterval((function() {
      a.$payRequestSync("POST", "/miniprogram/queryelecresult", {
        billno: that.data.billno
      }, (function(e, n) {
        if (e)
          if (200 === n.statusCode) {
            if (t += 1, 0 == n.data.retcode) {
              var o = n.data.data;
              2 == o.billstatus ? (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), a.$showModal("提示", "充值成功", "回首页")) : 2 != o.billstatus && 1 != o.billstatus && (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), a.$showModal("提示", "充值失败", "回首页"))
            }
          } else wx.hideLoading({
            complete: function(t) {}
          }), wx.showModal({
            title: "错误",
            content: "后台错误 " + n.statusCode,
            confirmText: "确定",
            showCancel: !1,
            duration: 4e3,
            success: function(t) {}
          }), clearInterval(that.data.setInter), that.setData({
            setInter: null
          });
        else wx.hideLoading({
          complete: function(t) {}
        }), wx.showModal({
          title: "错误",
          content: "后台错误 " + n.statusCode,
          confirmText: "确定",
          showCancel: !1,
          duration: 4e3,
          success: function(t) {}
        }), clearInterval(that.data.setInter), that.setData({
          setInter: null
        });
        3 === t && (wx.hideLoading({
          complete: function(t) {}
        }), clearInterval(that.data.setInter), that.setData({
          setInter: null
        }), wx.showModal({
          title: "错误",
          content: "请求超时",
          duration: 4e3
        }))
      }))
    }), 3e3)
  },
  getPwd: function(t) {
    this.setData({
      pwd: t.detail.pwd,
      status: !1
    }), this.rechargeInit()
  },
  getPwdToPay: function(t) {
    this.setData({
      pwd: t.detail.pwd,
      status: !1
    }), this.rechargeInit()
  },
  changePayKind: function(t) {
    this.setData({
      index: t.detail.value
    })
  },
  onHide: function() {
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  },
  onUnload: function() {
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  }
});