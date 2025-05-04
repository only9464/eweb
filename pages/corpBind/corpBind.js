var e = require("../../utils/request.js");
Page({
  data: {
    show: !1
  },
  onLoad: function(e) {
    this.getToken()
  },
  back: function() {
    wx.navigateBack()
  },
  getToken: function() {
    var t = this;
    wx.login({
      success: function(a) {
        var o = {
          code: a.code
        };
        wx.request({
          url: e.baseUrl + "/wechatauth/token",
          data: o,
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
                var a = e.data.data.pwdrule;
                wx.setStorageSync("pwdrule", a), wx.setStorageSync("ssl", !1), t.getQyMsg()
              } else if (0 == e.data.retcode) {
              var o = e.data.data.expiretime,
                n = e.data.data.token,
                s = e.data.data.ssltype,
                c = (e.data.data.ssl, e.data.data.pwdrule);
              wx.setStorageSync("pwdrule", c), wx.setStorageSync("ssl", !1), wx.setStorageSync("ssltype", s), wx.setStorageSync("token", n), wx.setStorageSync("expiretime", o), wx.reLaunch({
                url: "/pages/index/index"
              })
            } else wx.showModal({
              title: "提示",
              content: e.data.retmsg,
              showCancel: !1,
              complete: function(e) {}
            }), t.setData({
              show: !0
            });
            else wx.showModal({
              title: "提示",
              content: "系统错误",
              showCancel: !1,
              complete: function(e) {}
            }), t.setData({
              show: !0
            })
          },
          fail: function(e) {
            t.setData({
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
  getQyMsg: function() {
    var t = this;
    "WeChat" != wx.getSystemInfoSync().host ? wx.qy.login({
      success: function(a) {
        if (a.code) {
          var o = {
            code: a.code
          };
          wx.request({
            url: e.baseUrl + "/wechatauth/corpMobile",
            data: o,
            method: "POST",
            timeout: 8e3,
            header: {
              "content-type": "application/json",
              charset: "utf-8"
            },
            success: function(e) {
              if (200 == e.statusCode)
                if (0 == e.data.retcode) {
                  var a = e.data.data.userid;
                  t.bind(a)
                } else t.setData({
                  show: !0
                }), wx.showModal({
                  title: "提示",
                  content: e.data.retcode + ":" + e.data.retmsg,
                  showCancel: !1,
                  complete: function(e) {}
                });
              else t.setData({
                show: !0
              }), wx.showModal({
                title: "提示",
                content: "系统错误",
                showCancel: !1,
                complete: function(e) {}
              })
            },
            fail: function(e) {
              t.setData({
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
      }
    }) : wx.showModal({
      title: "提示",
      content: "请在企业微信中打开小程序进行认证",
      showCancel: !1
    })
  },
  bind: function(t) {
    wx.login({
      complete: function(a) {
        var o = a.code,
          n = "";
        wx.getSystemInfo({
          success: function(e) {
            n = e.model
          }
        });
        var s = {
          stuempno: t,
          code: o,
          model: n
        };
        e.$requestSync("POST", "/wechatauth/bindaccountByqy", s, (function(e, t) {
          var a = t.retcode;
          if (e) {
            if ("0" == a) {
              var o = t.data.token,
                n = t.data.expiretime;
              wx.setStorageSync("token", o), wx.setStorageSync("expiretime", n), wx.reLaunch({
                url: "/pages/index/index"
              })
            }
          } else "9" == a && wx.showToast({
            title: t.retmsg,
            icon: "none",
            success: function() {
              setTimeout((function() {
                wx.reLaunch({
                  url: "/pages/bind/bind"
                }, 1500)
              }))
            }
          })
        }), {
          isNeedToken: !1
        })
      }
    })
  }
});