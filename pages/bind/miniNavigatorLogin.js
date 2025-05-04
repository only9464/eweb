var e = require("../../utils/request.js");
Page({
  data: {},
  onLoad: function() {
    this.init()
  },
  init: function() {
    wx.login({
      success: function(t) {
        var a = {
          code: t.code
        };
        wx.request({
          url: e.baseUrl + "/wechatauth/token",
          data: a,
          method: "POST",
          timeout: 8e3,
          header: {
            "content-type": "application/json",
            charset: "utf-8"
          },
          success: function(e) {
            if (200 === e.statusCode)
              if (9 == e.data.retcode) {
                e.data.data.ssl;
                var t = e.data.data.pwdrule;
                wx.setStorageSync("pwdrule", t), wx.setStorageSync("ssl", !1), that.bind()
              } else if (0 == e.data.retcode) {
              var a = e.data.data.expiretime,
                n = e.data.data.token,
                s = e.data.data.ssltype,
                o = (e.data.data.ssl, e.data.data.pwdrule);
              wx.setStorageSync("pwdrule", o), wx.setStorageSync("ssl", !1), wx.setStorageSync("ssltype", s), wx.setStorageSync("token", n), wx.setStorageSync("expiretime", a), wx.reLaunch({
                url: "/pages/index/index"
              })
            } else wx.showModal({
              title: "提示",
              content: e.data.retmsg,
              showCancel: !1,
              complete: function(e) {}
            }), that.setData({
              show: !0
            });
            else wx.showModal({
              title: "提示",
              content: "系统错误",
              showCancel: !1,
              complete: function(e) {}
            }), that.setData({
              show: !0
            })
          },
          fail: function(e) {
            that.setData({
              show: !0
            }), wx.showModal({
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
  bind: function() {
    var t = wx.getLaunchOptionsSync().referrerInfo;
    if (t != {} && null != t) {
      var a = t.extraData.dhssoCode;
      null != a && "" != a ? wx.login({
        success: function(t) {
          var n = t.code,
            s = {
              dhssoCode: a,
              code: n
            };
          e.$requestSync("POST", "/miniprogram/getThirdappMsg", s, (function(e, t) {
            console.log(t), t.retcode && wx.reLaunch({
              url: "/pages/index/index"
            })
          }), {
            isNeedToken: !1
          })
        }
      }) : wx.navigateTo({
        url: "/pages/bind/bind"
      })
    } else wx.navigateTo({
      url: "/pages/bind/bind"
    })
  }
});