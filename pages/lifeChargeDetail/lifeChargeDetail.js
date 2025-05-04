var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    msg: {},
    pwd: "123",
    billno: "",
    showPwdInput: !1
  },
  onLoad: function(t) {
    wx.setNavigationBarTitle({
      title: a.t("lifePay")
    });
    var e = JSON.parse(t.msg);
    this.setData({
      msg: e
    })
  },
  doNext: function(t) {
    var a = this,
      n = {
        billid: this.data.msg.billid
      };
    e.$requestSync("POST", "/miniprogram/lifebillinit", n, (function(t, e) {
      0 == e.retcode && (a.setData({
        billno: e.data.billno
      }), a.rechargeInit())
    }))
  },
  rechargeInit: function() {
    var t = this,
      a = {
        amount: parseInt(100 * parseFloat(t.data.msg.amount) + .5),
        pwd: t.data.pwd,
        billno: t.data.billno
      };
    e.$requestSync("POST", "/miniprogram/balancepay", a, (function(a, n) {
      if (0 == n.retcode) {
        wx.showLoading({
          title: "请求中",
          mask: !0
        });
        var i = 0;
        t.data.setInter = setInterval((function() {
          e.$payRequestSync("POST", "/miniprogram/queryresult", {
            billno: t.data.billno
          }, (function(a, n) {
            if (a)
              if (200 === n.statusCode) {
                if (i += 1, 0 == n.data.retcode) {
                  var o = n.data.data;
                  2 == o.billstatus ? (clearInterval(t.data.setInter), wx.hideLoading({
                    complete: function(t) {}
                  }), e.$showModal("提示", "充值成功", "回首页")) : 2 != o.billstatus && 1 != o.billstatus && (clearInterval(t.data.setInter), wx.hideLoading({
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
            3 === i && (wx.hideLoading({
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
  },
  close: function() {
    this.setData({
      showPwdInput: !1
    })
  },
  getPwd: function(t) {
    this.setData({
      pwd: t.detail.pwd,
      showPwdInput: !1
    }), this.doNext()
  },
  openPwdInput: function() {
    this.setData({
      showPwdInput: !0
    })
  }
});