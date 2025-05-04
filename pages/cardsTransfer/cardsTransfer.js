var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = getApp(),
  n = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    status: !1,
    username: "",
    id: "",
    balance: "",
    amount: "",
    stopClick: !1,
    setInter: "",
    type: ""
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      s = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "cardsTransfer" == t.id && (s = t)
      }))
    })), wx.setNavigationBarTitle({
      title: n.t(s.id, {
        value: "en-US" != this.data.$_locale ? s.title : s.entitle
      })
    }), this.setData({
      balance: a.globalData.userInfo.balance,
      type: wx.getStorageSync("ssltype")
    })
  },
  onceTransfer: function() {
    this.setData({
      stopClick: !0
    }), this.onTransfer()
  },
  onTransfer: function() {
    var t = this,
      a = t.data,
      n = a.username,
      s = a.id,
      o = a.amount,
      i = a.balance;
    if (e.$isEmpty(n) || e.$isEmpty(s)) return wx.showModal({
      title: "错误",
      content: "请填写收款人信息",
      showCancel: !1,
      success: function(e) {
        t.setData({
          stopClick: !1
        })
      }
    }), !1;
    if (e.$isEmpty(o)) return wx.showModal({
      title: "错误",
      content: "转帐金额不能为空",
      showCancel: !1,
      success: function(e) {
        t.setData({
          stopClick: !1
        })
      }
    }), !1;
    if (!e.$isDot(o)) {
      var c = o.indexOf(".");
      if (o.substr(c + 1).length > 2) return wx.showModal({
        title: "错误",
        content: "转账金额含小数点后不能超过两位",
        showCancel: !1,
        success: function(e) {
          t.setData({
            stopClick: !1
          })
        }
      }), !1
    }
    if (Number(o) > Number(i)) return console.log(o, i), wx.showModal({
      title: "错误",
      content: "转入金额不能大于自身账户余额",
      showCancel: !1,
      success: function(e) {
        t.setData({
          stopClick: !1
        })
      }
    }), !1;
    e.$requestSync("POST", "/miniprogram/cardbaltransferinit", {}, (function(a, i) {
      if (0 == i.retcode) {
        var c = i.data.billno,
          r = {
            to_custname: n,
            to_stuempno: s,
            amount: 100 * o,
            billno: c
          };
        e.$requestSync("POST", "/miniprogram/cardbaltransfer", r, (function(a, n) {
          if (0 == n.retcode) {
            wx.showLoading({
              title: "请求中",
              mask: !0
            });
            var s = 0;
            t.data.setInter = setInterval((function() {
              e.$payRequestSync("POST", "/miniprogram/cardbaltransforresult", r, (function(a, n) {
                if (a)
                  if (200 === n.statusCode) {
                    if (s += 1, 0 == n.data.retcode) {
                      var o = n.data.data;
                      "success" == o.status ? (clearInterval(t.data.setInter), wx.hideLoading({
                        complete: function(t) {}
                      }), e.$showModal("提示", "转账成功", "回首页")) : "fail" == o.status && (clearInterval(t.data.setInter), wx.hideLoading({
                        complete: function(t) {}
                      }), e.$showModal("提示", "转账失败", "回首页"))
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
                  }), clearInterval(t.data.setInter);
                else wx.hideLoading({
                  complete: function(t) {}
                }), wx.showModal({
                  title: "错误",
                  content: "后台错误 " + n.statusCode,
                  confirmText: "确定",
                  showCancel: !1,
                  duration: 4e3,
                  success: function(t) {}
                }), clearInterval(t.data.setInter);
                3 === s && (wx.hideLoading({
                  complete: function(t) {}
                }), clearInterval(t.data.setInter), wx.showModal({
                  title: "错误",
                  content: "请求超时",
                  duration: 4e3
                }))
              }))
            }), 3e3)
          }
        }))
      }
      t.setData({
        stopClick: !1
      })
    }))
  },
  closePwd: function(t) {
    this.setData({
      status: t.detail.off
    })
  },
  getUsername: function(t) {
    this.setData({
      username: t.detail.value
    })
  },
  getId: function(t) {
    this.setData({
      id: t.detail.value
    })
  },
  getBalance: function(t) {
    this.setData({
      amount: t.detail.value
    })
  },
  onUnload: function() {
    clearInterval(this.data.setInter)
  }
});