var t = require("@miniprogram-i18n/core"),
  a = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    pwd: ""
  },
  onLoad: function(t) {
    wx.setNavigationBarTitle({
      title: a.t("add_bathCode")
    });
    var e = t.code;
    this.setData({
      pwd: e
    })
  }
});