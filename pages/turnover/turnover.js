var t = require("@miniprogram-i18n/core"),
  e = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    leftOright: !0,
    showDeleteIcon: !1,
    loadingAuth: !0,
    loadingPay: !0,
    type: wx.getStorageSync("ssltype"),
    subColor: "#3C9DFB"
  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: e.t("bills")
    })
  },
  changeTurnoverList: function(t) {
    var e = t.currentTarget.dataset.boolean;
    e != this.data.leftOright && (this.setData({
      leftOright: e
    }), this.data.leftOright ? this.selectComponent("#fliterPay").getPayList() : this.selectComponent("#fliterAuth").getAuthList())
  }
});