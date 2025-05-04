var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  i = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    list: []
  },
  onLoad: function() {
    var t = wx.getStorageSync("funcPart"),
      e = {};
    t.length && (t.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "outSpecialFound" == t.id && (e = t)
      }))
    })), wx.setNavigationBarTitle({
      title: i.t(e.id, {
        value: "en-US" != this.data.$_locale ? e.title : e.entitle
      })
    })), this.getFundList(wx.getStorageSync("user").stuempno)
  },
  getFundList: function(t) {
    var i = this,
      n = {
        stuempno: t
      };
    e.$requestSync("POST", "/miniprogram/getSpecialFunds", n, (function(t, e) {
      if (0 == e.retcode) {
        var n = e.data.accexlist;
        n.length && (n.forEach((function(t) {
          t.balance = (t.availlimit / 100).toFixed(2)
        })), i.setData({
          list: n
        }))
      }
    }))
  }
});