var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = require("../../utils/throttle.js"),
  n = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    msg: "",
    status: !1,
    setInter: null,
    pwd: ""
  },
  onLoad: function(t) {
    wx.setNavigationBarTitle({
      title: n.t("scanPay")
    });
    if (t.data) {
      var a = JSON.parse(t.data);
      a.money = (a.amount / 100).toFixed(2), this.setData({
        msg: a
      })
    }
  },
  close: function() {
    this.setData({
      status: !1
    })
  },
  getPwdToPay: function(t) {
    this.setData({
      pwd: t.detail.pwd,
      status: !1
    }), this.pay()
  },
  pay: e.throttle((function() {
    var t = this,
      e = t.data.msg,
      n = {
        billno: e.billno,
        amount: e.amount,
        pwd: t.data.pwd ? t.data.pwd : ""
      };
    a.$requestSync("POST", "/miniprogram/balancepay", n, (function(e, n) {
      e ? (console.log(n.data.retcode), 0 == n.data.retcode ? a.$payRequestSync("POST", "/miniprogram/queryresult", {
        billno: t.data.msg.billno
      }, (function(a, e) {
        if (wx.hideLoading({
            complete: function(t) {}
          }), a)
          if (200 === e.statusCode) {
            if (0 == e.data.retcode) {
              var n = e.data.data,
                s = {};
              s.billstatus = n.billstatus, s.amount = n.amount, s.shopname = n.shopname, s.termname = n.termname, s.billname = n.billname, s.paytime = n.paytime, s.refno = n.refno;
              var i = JSON.stringify(s);
              2 == n.billstatus || 2 != n.billstatus && 1 != n.billstatus ? wx.reLaunch({
                url: "/pages/payResult/payResult?data=" + i
              }) : 1 == n.billstatus && t.confirm()
            }
          } else wx.showModal({
            title: "错误",
            content: "后台错误 " + e.statusCode,
            confirmText: "确定",
            showCancel: !1,
            duration: 4e3,
            success: function(t) {}
          });
        else wx.showModal({
          title: "错误",
          content: "后台错误 " + e.statusCode,
          confirmText: "确定",
          showCancel: !1,
          duration: 4e3,
          success: function(t) {}
        })
      })) : 77 == n.data.retcode && t.setData({
        status: !0
      })) : t.setData({
        pwd: ""
      })
    }))
  }), 1500),
  confirm: function() {
    var t = this;
    wx.showLoading({
      title: "请求中",
      mask: !0
    });
    var e = 0;
    clearInterval(t.data.setInter), t.setData({
      setInter: null
    }), t.data.setInter = setInterval((function() {
      a.$payRequestSync("POST", "/miniprogram/queryresult", {
        billno: t.data.msg.billno
      }, (function(a, n) {
        if (a)
          if (200 === n.statusCode) {
            if (e += 1, console.log(e), 0 == n.data.retcode) {
              wx.hideLoading({
                complete: function(t) {}
              });
              var s = n.data.data,
                i = {};
              i.billstatus = s.billstatus, i.amount = s.amount, i.shopname = s.shopname, i.termname = s.termname, i.billname = s.billname, i.paytime = s.paytime, i.refno = s.refno;
              var l = JSON.stringify(i);
              (2 == s.billstatus || 2 != s.billstatus && 1 != s.billstatus) && (clearInterval(t.data.setInter), t.setData({
                setInter: null
              }), wx.reLaunch({
                url: "/pages/payResult/payResult?data=" + l
              }))
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
          }), clearInterval(t.data.setInter), t.setData({
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
        }), clearInterval(t.data.setInter), t.setData({
          setInter: null
        });
        3 === e && (wx.hideLoading({
          complete: function(t) {}
        }), clearInterval(t.data.setInter), t.setData({
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
    }), this.pay()
  },
  onUnload: function() {
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  },
  onHide: function() {
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  }
});