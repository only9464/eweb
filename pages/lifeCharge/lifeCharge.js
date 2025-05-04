var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    msg: []
  },
  onLoad: function(t) {
    wx.setNavigationBarTitle({
      title: e.t("lifePay")
    });
    var r = this;
    if (a.$isEmpty(wx.getStorageSync("isBindWateroom"))) {
      var s = JSON.parse(wx.getStorageSync("waterData"));
      if (wx.$isEmpty(s)) return void wx.showModal({
        title: "错误",
        content: "获取房间信息失败",
        showCancel: !1
      });
      s.forEach((function(t) {
        t.date = t.startdate.substr(0, 4) + "-" + t.startdate.substr(4, 2) + "-" + t.startdate.substr(6, 2)
      })), r.setData({
        msg: s
      })
    } else {
      var i = JSON.parse(wx.getStorageSync("isBindWateroom"));
      a.$requestSync("POST", "/miniprogram/getlifebills", i, (function(t, a) {
        var e = a.data.billlist;
        e.forEach((function(t) {
          t.date = t.startdate.substr(0, 4) + "-" + t.startdate.substr(4, 2) + "-" + t.startdate.substr(6, 2)
        })), 0 == a.retcode && r.setData({
          msg: e
        })
      }))
    }
  },
  toDetail: function(t) {
    var a = t.currentTarget.dataset.index;
    wx.navigateTo({
      url: "/pages/lifeChargeDetail/lifeChargeDetail?msg=" + JSON.stringify(this.data.msg[a])
    })
  },
  backto: function() {
    wx.removeStorageSync("isBindWateroom"), wx.reLaunch({
      url: "/pages/lifePay/lifePay"
    })
  }
});