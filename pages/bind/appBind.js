var e = require("../../utils/layout"),
  t = require("../../utils/request.js");
Page({
  data: {
    url: "/pages/index/index",
    isNeedDecode: !0
  },
  onLoad: function(t) {
    var a = null == t ? void 0 : t.token;
    if (t.s) {
      a = t.s;
      var o = e.functionPart.findIndex((function(e) {
        return (null == t ? void 0 : t.id) === e.id
      }));
      this.setData({
        url: -1 != o ? e.functionPart[o].path : "/pages/index/index",
        isNeedDecode: !1
      })
    }
    this.init(a)
  },
  init: function(e) {
    var a = this;
    wx.login({
      success: function(o) {
        wx.request({
          url: t.baseUrl + "/wechatauth/token",
          data: {
            code: o.code
          },
          method: "POST",
          timeout: 8e3,
          header: {
            "content-type": "application/json",
            charset: "utf-8"
          },
          success: function(t) {
            200 === t.statusCode ? 9 == t.data.retcode ? (wx.setStorageSync("pwdrule", t.data.data.pwdrule), wx.setStorageSync("ssl", !1), a.bind(e)) : 0 == t.data.retcode ? (wx.setStorageSync("pwdrule", t.data.data.pwdrule), wx.setStorageSync("ssl", !1), wx.setStorageSync("ssltype", t.data.data.ssltype), wx.setStorageSync("token", t.data.data.token), wx.setStorageSync("expiretime", t.data.data.expiretime), wx.reLaunch({
              url: a.data.url
            })) : a.showModal(t.data.retmsg) : a.showModal(t.errMsg)
          },
          fail: function(e) {
            a.showModal(e.errMsg)
          }
        })
      }
    })
  },
  bind: function(e) {
    var a = this;
    wx.login({
      success: function(o) {
        var s = {
          code: o.code,
          dhssoCode: e,
          isNeedDecode: a.data.isNeedDecode
        };
        wx.request({
          url: t.baseUrl + "/miniprogram/getAppTokenBind",
          timeout: 8e3,
          method: "POST",
          data: s,
          header: {
            "content-type": "application/json",
            charset: "utf-8"
          },
          success: function(e) {
            200 == e.statusCode ? "0" == e.data.retcode ? wx.reLaunch({
              url: a.data.url
            }) : a.showModal(e.data.retmsg) : a.showModal(e.errMsg)
          },
          fail: function(e) {
            a.showModal(e.errMsg)
          }
        })
      }
    })
  },
  showModal: function(e) {
    wx.showModal({
      title: "温馨提示",
      content: e || "发生故障！",
      showCancel: !1
    })
  }
});