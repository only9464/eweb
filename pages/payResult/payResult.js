var t = require("@miniprogram-i18n/core"),
  a = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    msg: {},
    scanRerult: !0,
    time: null,
    secend: ""
  },
  onLoad: function(t) {
    if (wx.setNavigationBarTitle({
        title: a.t("payResult")
      }), "qrcode" == t.from) return this.setData({
      msg: JSON.parse(t.data),
      scanRerult: !1
    }), void this.timer();
    if (t.data) {
      var e = JSON.parse(t.data);
      e.amount = e.amount.toFixed(2), this.setData({
        msg: e
      })
    }
  },
  goBack: function() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  timer: function() {
    var t = this,
      a = 5;
    this.data.time = setInterval((function() {
      t.setData({
        secend: a + "s"
      }), 0 == --a && (clearInterval(t.data.time), t.setData({
        time: null
      }), wx.switchTab({
        url: "/pages/index/index"
      }))
    }), 1e3)
  },
  onUnload: function() {
    clearInterval(this.data.time), this.setData({
      time: null
    })
  }
});