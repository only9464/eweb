var e = require("../../utils/request.js"),
  t = getApp();
Page({
  onLoad: function(e) {
    if (e.url) {
      var t = decodeURIComponent(e.url);
      this.setData({
        src: t + (t.indexOf("?") >= 0 ? "&t=" + wx.getStorageSync("token").substr(7, wx.getStorageSync("token").length - 7) : "?t=" + wx.getStorageSync("token").substr(7, wx.getStorageSync("token").length - 7))
      })
    } else this.getWebviewH5Url(e)
  },
  getWebviewH5Url: function(t) {
    var n = this,
      a = {};
    a.id = t.id, e.$requestSync("POST", "/miniprogram/getWebviewH5UrlById", a, (function(e, t) {
      var a = t.data;
      n.setData({
        src: a
      })
    }))
  },
  getEncodedStr: function(e) {
    var n = wx.getStorageSync("user") || t.globalData.userInfo,
      a = "";
    switch (e) {
      case "touchorder":
        a = "person_id=".concat(n.stuempno, "&user_name=").concat(n.name || n.custname);
        break;
      case "newcapecH5":
        a = "stuempno=".concat(n.stuempno, "&custname=").concat(n.name || n.custname, "&mobile=").concat(n.mobile);
        break;
      case "SM4":
        a = JSON.stringify({
          custname: n.name || n.custname,
          stuempno: n.stuempno
        })
    }
    return a
  }
});