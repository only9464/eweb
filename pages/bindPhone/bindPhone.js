var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  n = (0, t.getI18nInstance)();
Page({
  data: {
    phone: ""
  },
  onLoad: function() {
    this.getNavigationBarTitle()
  },
  getNavigationBarTitle: function() {
    var t = wx.getStorageSync("funcPart"),
      e = {};
    t.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "bindPhone" == t.id && (e = t)
      }))
    })), wx.setNavigationBarTitle({
      title: n.t(e.id, {
        value: "en-US" != this.data.$_locale ? e.title : e.entitle
      })
    })
  },
  getPhone: function(t) {
    var e = t.detail.value;
    this.setData({
      phone: e
    })
  },
  bind: function() {
    var t = {
      phone: this.data.phone
    };
    e.$requestSync("POST", "/miniprogram/bindphone", t, (function(t, n) {
      "0" == n.retcode && e.$showModal("提示", "绑定成功", "返回首页")
    }))
  }
});