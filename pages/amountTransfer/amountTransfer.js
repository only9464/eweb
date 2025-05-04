var t = require("@miniprogram-i18n/core"),
  n = getApp(),
  i = require("../../utils/request.js"),
  e = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    accountinfo: {},
    type: ""
  },
  onLoad: function(t) {
    var i = t.id ? t.id : "amountTransfer",
      o = (t.title && t.title, wx.getStorageSync("funcPart")),
      c = {};
    o.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        t.id == i && (c = t)
      }))
    })), wx.setNavigationBarTitle({
      title: e.t(c.id, {
        value: "en-US" != this.data.$_locale ? c.title : c.entitle
      })
    }), this.setData({
      accountinfo: n.globalData.userInfo,
      type: i
    })
  },
  init: function() {
    wx.showModal({
      title: "提示",
      content: "账户余额将会退回已绑定银行卡中，确认要进行销户操作吗?",
      success: function(t) {
        t.confirm && i.$requestSync("POST", "/zzxh/init", {}, (function(t, n) {
          0 == n.retcode && i.$showModal("提示", n.data, "返回首页")
        }))
      }
    })
  },
  refund: function() {
    wx.showModal({
      title: "提示",
      content: "确认要将校园卡内余额转入银行卡内吗?",
      success: function(t) {
        t.confirm && i.$requestSync("POST", "/miniprogram/refundtothird", {}, (function(t, n) {
          0 == n.retcode && console.log(n)
        }))
      }
    })
  },
  start: function() {
    "closeAccount" == this.data.type ? this.init() : this.refund()
  }
});