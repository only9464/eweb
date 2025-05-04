var e = require("../../@babel/runtime/helpers/objectSpread2");
Page({
  data: {
    show: !1,
    type: "warn",
    result: "参数错误"
  },
  launchAppError: function(e) {
    wx.showToast({
      title: e.detail.errMsg,
      icon: "none"
    })
  },
  onLoad: function(e) {
    try {
      this.pay(JSON.parse(decodeURIComponent(null == e ? void 0 : e.param)))
    } catch (e) {
      wx.showModal({
        title: "温馨提示",
        content: "参数错误",
        showCancel: !1
      })
    }
  },
  pay: function(t) {
    wx.requestPayment(e(e({}, t), {}, {
      success: function(e) {
        wx.showModal({
          title: "温馨提示",
          content: "支付成功！",
          showCancel: !1,
          success: function(e) {
            wx.exitMiniProgram()
          }
        })
      },
      fail: function(e) {
        wx.showModal({
          title: "温馨提示",
          content: e.errMsg.indexOf("cancel") >= 0 ? "支付取消！" : "支付失败！",
          showCancel: !1,
          success: function(e) {
            wx.exitMiniProgram()
          }
        })
      }
    }))
  },
  base64_decode: function(e) {
    var t, r, o, n, a, c, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      d = "",
      h = 0;
    for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < e.length;) t = i.indexOf(e.charAt(h++)) << 2 | (n = i.indexOf(e.charAt(h++))) >> 4, r = (15 & n) << 4 | (a = i.indexOf(e.charAt(h++))) >> 2, o = (3 & a) << 6 | (c = i.indexOf(e.charAt(h++))), d += String.fromCharCode(t), 64 != a && (d += String.fromCharCode(r)), 64 != c && (d += String.fromCharCode(o));
    return this.utf8_decode(d)
  },
  utf8_decode: function(e) {
    for (var t = "", r = 0, o = 0, n = 0, a = 0; r < e.length;)(o = e.charCodeAt(r)) < 128 ? (t += String.fromCharCode(o), r++) : o > 191 && o < 224 ? (n = e.charCodeAt(r + 1), t += String.fromCharCode((31 & o) << 6 | 63 & n), r += 2) : (n = e.charCodeAt(r + 1), a = e.charCodeAt(r + 2), t += String.fromCharCode((15 & o) << 12 | (63 & n) << 6 | 63 & a), r += 3);
    return t
  }
});