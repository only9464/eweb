var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    inteBalance: "",
    userName: "",
    enterInteId: "",
    inteFee: "",
    sysList: [],
    show: !1,
    sysIndex: 0,
    pwd: "",
    billno: "",
    setInter: "",
    status: !1,
    array: [{
      bankname: "卡余额充值",
      bankcode: "card"
    }],
    index: 0,
    accountList: []
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      n = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "parkPay" == t.id && (n = t)
      }))
    })), wx.setNavigationBarTitle({
      title: a.t(n.id, {
        value: "en-US" != this.data.$_locale ? n.title : n.entitle
      })
    }), this.setData({
      accountList: wx.getStorageSync("parkAccountList") ? wx.getStorageSync("parkAccountList") : []
    })
  },
  changePayKind: function(t) {
    this.setData({
      index: t.detail.value
    })
  },
  setAccount: function(t) {
    this.setData({
      enterInteId: t.currentTarget.dataset.account
    })
  },
  getCanUseBank: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/getbanks", {}, (function(e, a) {
      if (0 == a.retcode) {
        var n = a.data.data ? a.data.data : [],
          i = t.data.array;
        n.length && n.forEach((function(e) {
          e.payflag && (i.push(e), "wxPay" == e.bankcode && t.setData({
            index: t.data.array.length - 1
          }))
        })), t.setData({
          array: i
        })
      }
    }))
  },
  getInteId: function(t) {
    this.setData({
      enterInteId: t.detail.value
    })
  },
  getInteFee: function(t) {
    this.setData({
      inteFee: t.detail.value
    })
  },
  query: function() {
    var t = this,
      a = t.data.enterInteId;
    if (7 == a.length)
      if (a) {
        var n = {
          netid: 2,
          payacc: a
        };
        e.$requestSync("POST", "/miniprogram/querynetfeebalance", n, (function(e, a) {
          0 == a.retcode && (t.getCanUseBank(), t.setData({
            inteBalance: a.data.balance,
            show: !0
          }))
        }))
      } else wx.showModal({
        title: "错误",
        content: "请输入车牌号",
        showCancel: !1
      });
    else wx.showModal({
      title: "温馨提示",
      content: "输入车牌号有误，请重新输入",
      showCancel: !1
    })
  },
  recharge: function() {
    var t = this;
    if (!e.$isDot(t.data.inteFee)) return wx.showModal({
      title: "错误",
      content: "充入金额不能含有小数点",
      showCancel: !1
    }), !1;
    var a = {
      netid: 2,
      payacc: t.data.enterInteId,
      amount: 100 * t.data.inteFee
    };
    e.$requestSync("POST", "/miniprogram/buynetfeeinit", a, (function(e, a) {
      0 == a.retcode && (t.setData({
        billno: a.data.billno
      }), 0 == t.data.index ? t.rechargeInit() : "wxPay" == t.data.array[t.data.index].bankcode && t.wxpay(a.data.billno))
    }))
  },
  wxpay: function(t) {
    var a = this,
      n = a.data.inteFee,
      i = {
        amount: 100 * Number(n),
        paymethod: "",
        billno: t
      };
    e.$requestSync("POST", "/miniprogram/wechatcharge", i, (function(t, n) {
      0 == n.retcode && (wx.showLoading({
        title: "请求中",
        mask: !0
      }), wx.requestPayment({
        timeStamp: n.data.timeStamp,
        nonceStr: n.data.nonceStr,
        package: n.data.packageValue,
        signType: "MD5",
        paySign: n.data.sign,
        success: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          });
          var n = wx.getStorageSync("parkAccountList") ? wx.getStorageSync("parkAccountList") : [];
          if (0 != n.length)
            if (3 == n.length) park, n.unshift(a.data.enterInteId), n.pop();
            else {
              n.forEach((function(t) {
                t != a.data.enterInteId && n.unshift(a.data.enterInteId)
              }))
            }
          else n.unshift(a.data.enterInteId);
          wx.setStorageSync("parkAccountList", n), e.$showModal("提示", "缴费成功", "回首页")
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
      }))
    }))
  },
  rechargeInit: function() {
    var t = this,
      a = {
        amount: 100 * t.data.inteFee,
        pwd: t.data.pwd,
        billno: t.data.billno
      };
    e.$requestSync("POST", "/miniprogram/balancepay", a, (function(a, n) {
      wx.hideLoading({
        complete: function(t) {}
      }), a ? 0 == n.data.retcode ? e.$payRequestSync("POST", "/miniprogram/querynetfeeresult", {
        billno: t.data.billno
      }, (function(a, n) {
        if (a)
          if (200 === n.statusCode) {
            if (0 == n.data.retcode) {
              var i = n.data.data;
              if (2 == i.billstatus) {
                var o = wx.getStorageSync("parkAccountList") ? wx.getStorageSync("parkAccountList") : [];
                if (0 != o.length)
                  if (3 == o.length) park, o.unshift(t.data.enterInteId), o.pop();
                  else {
                    o.forEach((function(e) {
                      e != t.data.enterInteId && o.unshift(t.data.enterInteId)
                    }))
                  }
                else o.unshift(t.data.enterInteId);
                wx.setStorageSync("parkAccountList", o), e.$showModal("提示", "缴费成功", "回首页")
              } else 2 != i.billstatus && 1 != i.billstatus ? e.$showModal("提示", "缴费失败", "回首页") : 1 == i.billstatus && t.confirm()
            }
          } else wx.showModal({
            title: "错误",
            content: "后台错误 " + n.statusCode,
            confirmText: "确定",
            showCancel: !1,
            duration: 4e3
          });
        else wx.showModal({
          title: "错误",
          content: "后台错误 " + n.statusCode,
          confirmText: "确定",
          showCancel: !1,
          duration: 4e3
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
      e.$payRequestSync("POST", "/miniprogram/querynetfeeresult", {
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
  backtosys: function() {
    wx.removeStorageSync("isBindInteroom"), wx.removeStorageSync("enterInteId"), wx.removeStorageSync("netid"), this.setData({
      show: !1
    }), this.getSystem()
  },
  close: function() {
    this.setData({
      status: !1
    })
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
    wx.getStorageSync("isBindInteroom") || (wx.removeStorageSync("enterInteId"), wx.removeStorageSync("netid"));
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  }
});