var n = require("@miniprogram-i18n/core");
(0, n.getI18nInstance)();
(0, n.I18nPage)({
  data: {
    isHavaOffline: !1
  },
  onLoad: function() {
    var n = wx.getStorageSync("funcPart") && wx.getStorageSync("funcPart")[0].funcList.concat(wx.getStorageSync("funcPart")[1].funcList) || [];
    this.setData({
      isHavaOffline: -1 != n.findIndex((function(n) {
        return "offline" == n.id
      }))
    })
  },
  toIndex: function() {
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },
  toOffline: function() {
    wx.reLaunch({
      url: "/pages/codefd/offline?origin=request"
    })
  }
});