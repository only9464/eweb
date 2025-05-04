var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    payKindsList: [{
      bankcode: "card",
      bankname: "校园卡支付",
      checked: !0,
      url: "/style/images/pay/wx_logo_app.png",
      useflag: !0
    }, {
      bankcode: "wxPay",
      bankname: "微信支付",
      checked: !1,
      url: "/style/images/pay/wx_logo_app.png",
      useflag: !1
    }],
    tradeData: {},
    index: 0
  },
  onLoad: function(t) {
    this.setData({
      tradeData: JSON.parse(t.data)
    }), this.initNaviBar()
  },
  getCanUseBank: function() {
    var t = this;
    a.$requestSync("POST", "/miniprogram/getbanks", {}, (function(a, e) {
      if (0 == e.retcode) {
        var n = e.data.data ? e.data.data : [];
        n.length > 0 && n.some((function(t) {
          return "wxPay" == t.bankcode && t.payflag
        }));
        var i = t.data.payKindsList;
        i[1].useflag = !0, t.setData({
          payKindsList: i
        })
      }
    }))
  },
  initNaviBar: function() {
    var t = wx.getStorageSync("funcPart"),
      a = {};
    t.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "payNotice" == t.id && (a = t)
      }))
    })), this.getCanUseBank(), wx.setNavigationBarTitle({
      title: e.t(a.id, {
        value: "en-US" != this.data.$_locale ? a.title : a.entitle
      })
    })
  },
  payInit: function() {
    "0" == this.data.index ? this.cardPay() : this.wxPay()
  },
  wxPay: function() {
    var t = this.data.tradeData,
      e = t.amount,
      n = t.billno,
      i = {
        amount: 100 * Number(e),
        paymethod: "",
        billno: n
      };
    a.$requestSync("POST", "/miniprogram/wechatcharge", i, (function(t, e) {
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
          }), a.$showModal("提示", "缴费成功", "回首页")
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
  cardPay: function() {
    var t = this,
      e = t.data.tradeData,
      n = e.amount,
      i = e.billno,
      o = {
        amount: 100 * Number(n),
        pwd: t.data.pwd,
        billno: i
      };
    a.$requestSync("POST", "/miniprogram/balancepay", o, (function(e, n) {
      e ? 0 == n.data.retcode ? a.$payRequestSync("POST", "/miniprogram/queryresult", {
        billno: i
      }, (function(e, n) {
        if (e)
          if (200 === n.statusCode) {
            if (0 == n.data.retcode) {
              var i = n.data.data;
              2 == i.billstatus ? a.$showModal("提示", "缴费成功", "回首页") : 2 != i.billstatus && 1 != i.billstatus ? a.$showModal("提示", "缴费失败", "回首页") : 1 == i.billstatus && t.confirm()
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
      a.$payRequestSync("POST", "/miniprogram/queryresult", {
        billno: that.data.tradeData.billno
      }, (function(e, n) {
        if (e)
          if (200 === n.statusCode) {
            if (t += 1, 0 == n.data.retcode) {
              var i = n.data.data;
              2 == i.billstatus ? (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), a.$showModal("提示", "充值成功", "回首页")) : 2 != i.billstatus && 1 != i.billstatus && (clearInterval(that.data.setInter), that.setData({
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
  radioChange: function(t) {
    this.setData({
      index: t.detail.value
    })
  },
  onUnload: function() {
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  }
});