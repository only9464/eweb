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
      bankname: "卡余额缴费",
      bankcode: "card"
    }],
    index: 0
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      a = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "elecQueryHgc" == t.id && (a = t)
      }))
    })), wx.setNavigationBarTitle({
      title: n.t(a.id, {
        value: "en-US" != this.data.$_locale ? a.title : a.entitle
      })
    });
    var o = JSON.parse(t.data);
    this.setData({
      roomid: t.roomid,
      roomname: o.roomName,
      areaid: 1,
      buildid: o.roomId,
      elcsysid: "oldsystem" == o.areaId ? 1 : o.elcsysid,
      restElecDegree: o.restElecDegree
    }), this.getCanUseBank()
  },
  getCanUseBank: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/getbanks", {}, (function(e, a) {
      if (0 == a.retcode) {
        var n = a.data.data ? a.data.data : [],
          o = t.data.array;
        n.length && n.forEach((function(e, a) {
          e.payflag && (o.push(e), "wxPay" == e.bankcode && t.setData({
            index: t.data.array.length - 1
          }))
        })), t.setData({
          array: o
        })
      }
    }))
  },
  changePayKind: function(t) {
    this.setData({
      index: t.detail.value
    })
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
    }) : wx.reLaunch({
      url: "/pages/elecQuery/elecQuery"
    })
  },
  doNext: a.throttle((function(t) {
    var a = this,
      n = this.data;
    if (!e.$isDot(n.amount)) return wx.showModal({
      title: "错误",
      content: "金额不能含有小数点",
      showCancel: !1
    }), !1;
    var o = {
      elcsysid: n.elcsysid,
      areaid: n.areaid,
      roomid: n.roomid,
      buildid: n.buildid ? n.buildid : "1",
      roomname: n.roomname ? n.roomname : "2",
      amount: 100 * n.amount
    };
    wx.showLoading({
      title: "请求中",
      mask: !0
    }), e.$requestSync("POST", "/miniprogram/buyelectrityinit", o, (function(t, e) {
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
      n = {
        amount: 100 * Number(a),
        paymethod: "",
        billno: t
      };
    e.$requestSync("POST", "/miniprogram/wechatcharge", n, (function(t, a) {
      0 == a.retcode && wx.requestPayment({
        timeStamp: a.data.timeStamp,
        nonceStr: a.data.nonceStr,
        package: a.data.packageValue,
        signType: "MD5",
        paySign: a.data.sign,
        success: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          });
          var a = wx.getStorageSync("elecAccountList") ? wx.getStorageSync("elecAccountList") : [];
          if (0 != a.length)
            if (3 == a.length) a.unshift(that.data.roomid), a.pop();
            else {
              a.forEach((function(t) {
                t != that.data.roomid && a.unshift(that.data.roomid)
              }))
            }
          else a.unshift(that.data.roomid);
          wx.setStorageSync("elecAccountList", a), e.$showModal("提示", "缴费成功", "回首页")
        },
        fail: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          }), wx.showModal({
            title: "错误",
            content: "缴费失败",
            showCancel: !1,
            success: function(t) {}
          })
        }
      })
    }))
  },
  rechargeInit: function() {
    var t = this,
      a = {
        elcsysid: t.data.elcsysid,
        areaid: t.data.areaid,
        roomid: t.data.roomid,
        buildid: t.data.buildid ? t.data.buildid : "1",
        roomname: t.data.roomname ? t.data.roomname : "1",
        amount: 100 * t.data.amount,
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
              var o = n.data.data;
              if (2 == o.billstatus) {
                var i = wx.getStorageSync("elecAccountList") ? wx.getStorageSync("elecAccountList") : [];
                if (0 != i.length)
                  if (3 == i.length) i.unshift(t.data.roomid), i.pop();
                  else {
                    i.forEach((function(e) {
                      e != t.data.roomid && i.unshift(t.data.roomid)
                    }))
                  }
                else i.unshift(t.data.roomid);
                wx.setStorageSync("elecAccountList", i), e.$showModal("提示", "缴费成功", "回首页")
              } else 2 != o.billstatus && 1 != o.billstatus ? e.$showModal("提示", "缴费失败", "回首页") : 1 == n.data.retcode && t.confirm()
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
              var o = n.data.data;
              2 == o.billstatus ? (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), e.$showModal("提示", "缴费成功", "回首页")) : 2 != o.billstatus && 1 != o.billstatus && (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), e.$showModal("提示", "缴费失败", "回首页"))
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