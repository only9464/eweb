require("../../@babel/runtime/helpers/Arrayincludes");
var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = require("../../utils/throttle.js"),
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
    var a = this,
      i = wx.getStorageSync("funcPart"),
      o = {};
    i.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "elecQuery" != t.id && "elecQuerySmis" != t.id || (o = t)
      }))
    })), wx.setNavigationBarTitle({
      title: n.t(o.id, {
        value: "en-US" != a.data.$_locale ? o.title : o.entitle
      })
    });
    var r = wx.getStorageSync("system_name") || "电控缴费",
      s = wx.getAccountInfoSync().miniProgram.appId;
    a.setData({
      isWaterSystem: -1 != r.indexOf("水"),
      rest: -1 != r.indexOf("水") ? "剩余水量(吨)" : ["wx2bd5919ee8323801"].includes(s) ? "剩余电量(元)" : "剩余电量(度/元)"
    }), wx.setNavigationBarTitle({
      title: r
    });
    var d = "number";
    if ("wx77c30a197a76fa27" == s && (d = "digit"), e.$isEmpty(wx.getStorageSync("isBindEleroom"))) {
      var l = JSON.parse(wx.getStorageSync("roomData"));
      if (wx.$isEmpty(l)) return void wx.showModal({
        title: "错误",
        content: "获取电控房间信息失败",
        showCancel: !1
      });
      a.setData({
        roomid: l.roomId,
        roomname: l.roomName,
        areaid: l.areaId,
        buildid: l.buiId,
        elcsysid: l.elcsysid,
        restElecDegree: l.restElecDegree,
        remark: wx.getStorageSync("remark") || "",
        enterType: d,
        appid: s
      })
    } else {
      var c = JSON.parse(wx.getStorageSync("isBindEleroom"));
      e.$requestSync("POST", "/miniprogram/queryroominfo", c, (function(t, e) {
        0 == e.retcode && a.setData({
          roomid: e.data.roomId,
          roomname: e.data.roomName,
          areaid: e.data.areaId,
          buildid: e.data.buiId,
          elcsysid: e.data.elcsysid,
          restElecDegree: e.data.restElecDegree,
          remark: wx.getStorageSync("remark") || "",
          enterType: d,
          appid: s
        })
      }))
    }
    a.getCanUseBank()
  },
  getCanUseBank: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/getbanks", {}, (function(e, a) {
      if (0 == a.retcode) {
        var n = a.data.data ? a.data.data : [],
          i = t.data.array;
        n.length && n.forEach((function(t) {
          t.payflag && i.push(t)
        })), t.setData({
          array: i
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
    console.log(t), this.setData({
      degreeIndex: t.detail.value
    })
  },
  backtoEle: function() {
    wx.removeStorageSync("isBindEleroom"), 2 == wx.getStorageSync("elec_type") ? wx.reLaunch({
      url: "/pages/elecQuerySmis/elecQuerySmis"
    }) : "wx77c30a197a76fa27" == this.data.appid ? wx.reLaunch({
      url: "/pages/elecQuery/elecQueryCqjtu"
    }) : wx.reLaunch({
      url: "/pages/elecQuery/elecQuery"
    })
  },
  doNext: a.throttle((function(t) {
    var a = this,
      n = this.data;
    if (!e.$isDot(n.amount) && "wx77c30a197a76fa27" != n.appid) return wx.showModal({
      title: "错误",
      content: "充值金额不能含有小数点",
      showCancel: !1
    }), !1;
    var i = {
      elcsysid: n.elcsysid || 0,
      areaid: n.areaid || 0,
      roomid: n.roomid || 0,
      buildid: n.buildid || 0,
      roomname: "".concat(n.remark).concat(n.isWaterSystem ? "水" : "电", "量：").concat(n.restElecDegree).concat(n.isWaterSystem ? "吨" : "度"),
      amount: parseInt(100 * parseFloat(n.amount) + .5)
    };
    e.$requestSync("POST", "/miniprogram/buyelectrityinit", i, (function(t, e) {
      0 == e.retcode && (a.setData({
        billno: e.data.billno
      }), 0 == n.index ? a.rechargeInit() : "wxPay" == n.array[n.index].bankcode && a.wxpay(e.data.billno))
    }))
  }), 5e3),
  close: function() {
    this.setData({
      status: !1
    })
  },
  wxpay: function(t) {
    var a = this.data.amount,
      n = Number(a),
      i = {
        amount: parseInt(100 * parseFloat(n) + .5),
        paymethod: "",
        billno: t
      };
    e.$requestSync("POST", "/miniprogram/wechatcharge", i, (function(t, a) {
      0 == a.retcode && (wx.showLoading({
        title: "请求中",
        mask: !0
      }), wx.requestPayment({
        timeStamp: a.data.timeStamp,
        nonceStr: a.data.nonceStr,
        package: a.data.packageValue,
        signType: "MD5",
        paySign: a.data.sign,
        success: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          }), e.$showModal("提示", "充值成功", "回首页")
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
      a = {
        elcsysid: t.data.elcsysid || 0,
        areaid: t.data.areaid || 0,
        roomid: t.data.roomid || 0,
        buildid: t.data.buildid || 0,
        roomname: t.data.roomname,
        amount: parseInt(100 * parseFloat(t.data.amount) + .5),
        pwd: t.data.pwd ? t.data.pwd : "",
        billno: t.data.billno
      };
    e.$requestSync("POST", "/miniprogram/balancepay", a, (function(a, n) {
      wx.hideLoading({
        complete: function(t) {}
      }), a ? 0 == n.data.retcode ? e.$payRequestSync("POST", "/miniprogram/queryelecresult", {
        billno: t.data.billno
      }, (function(a, n) {
        if (a)
          if (200 === n.statusCode) {
            if (0 == n.data.retcode) {
              var i = n.data.data;
              2 == i.billstatus ? e.$showModal("提示", "充值成功", "回首页") : 2 != i.billstatus && 1 != i.billstatus ? e.$showModal("提示", "充值失败", "回首页") : 1 == n.data.retcode && t.confirm()
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
      e.$payRequestSync("POST", "/miniprogram/queryelecresult", {
        billno: that.data.billno
      }, (function(a, n) {
        if (a)
          if (200 === n.statusCode) {
            if (t += 1, 0 == n.data.retcode) {
              var i = n.data.data;
              2 == i.billstatus ? (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), e.$showModal("提示", "充值成功", "回首页")) : 2 != i.billstatus && 1 != i.billstatus && (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), e.$showModal("提示", "充值失败", "回首页"))
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