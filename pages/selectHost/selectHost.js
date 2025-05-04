var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js");
(0, e.getI18nInstance)();
(0, e.I18nPage)({
  toCorpBind: function() {
    wx.navigateTo({
      url: "/pages/corpBind/corpBind"
    })
  },
  toAuthCorpBind: function() {
    wx.navigateTo({
      url: "/pages/authCorpBind/authCorpBind"
    })
  },
  getHost: function() {
    wx.getSystemInfo({
      success: function(e) {
        var t = e.environment ? e.environment : "wechat";
        console.log(e), "wxwork" == t ? wx.navigateTo({
          url: "/pages/corpBind/corpBind"
        }) : wx.navigateTo({
          url: "/pages/authCorpBind/authCorpBind"
        })
      }
    })
  },
  getToken: function() {
    var e = this;
    wx.login({
      success: function(n) {
        var o = {
          code: n.code
        };
        wx.request({
          url: t.baseUrl + "/wechatauth/token",
          data: o,
          method: "POST",
          timeout: 8e3,
          header: {
            "content-type": "application/json",
            charset: "utf-8"
          },
          success: function(t) {
            if (200 === t.statusCode)
              if (9 == t.data.retcode) {
                t.data.data.ssl;
                var n = t.data.data.pwdrule;
                wx.setStorageSync("pwdrule", n), wx.setStorageSync("ssl", !1), e.getHost()
              } else if (0 == t.data.retcode) {
              var o = t.data.data.expiretime,
                a = t.data.data.token,
                s = t.data.data.ssltype,
                r = t.data.data.pwdrule;
              wx.setStorageSync("pwdrule", r), wx.setStorageSync("ssl", !1), wx.setStorageSync("ssltype", s), wx.setStorageSync("token", a), wx.setStorageSync("expiretime", o), wx.reLaunch({
                url: "/pages/index/index"
              })
            } else wx.showModal({
              title: "提示",
              content: t.data.retmsg,
              showCancel: !1,
              complete: function(e) {}
            });
            else wx.showModal({
              title: "提示",
              content: "系统错误",
              showCancel: !1,
              complete: function(e) {}
            })
          },
          fail: function(e) {
            wx.showModal({
              title: "提示",
              content: e.errMsg,
              showCancel: !1,
              complete: function(e) {}
            })
          }
        })
      }
    })
  },
  onLoad: function(e) {
    if (wx.hideHomeButton(), void 0 !== e.errcode) {
      var t = e.errmsg,
        n = e.errcode;
      0 == n || null == n ? null != n && 0 == n && setTimeout((function() {
        wx.reLaunch({
          url: "/pages/index/index"
        })
      }), 1e3) : setTimeout((function() {
        wx.showModal({
          title: "提示",
          content: t,
          showCancel: !1
        })
      }), 1e3)
    } else this.getToken()
  }
});