var a = require("@miniprogram-i18n/core"),
  t = getApp(),
  e = (0, a.getI18nInstance)();
(0, a.I18nPage)({
  data: {
    accountinfo: {},
    avatar: "",
    type: wx.getStorageSync("ssltype")
  },
  onLoad: function(a) {
    wx.setNavigationBarTitle({
      title: e.t("userDetails")
    });
    var r = wx.getStorageSync("avatar"),
      s = t.globalData.userInfo.expiredate;
    s && (s = s.substr(0, 4) + "-" + s.substr(4, 2) + "-" + s.substr(6, 2));
    var n = "2001";
    1 == n[0] ? n = "正常" : n = (1 == n[1] ? "挂失-" : "") + (1 == n[2] ? "冻结-" : "") + (1 == n[3] ? "坏卡" : "");
    this.setData({
      accountinfo: t.globalData.userInfo,
      avatar: r,
      expiredate: s,
      cardstatus: n
    })
  }
});