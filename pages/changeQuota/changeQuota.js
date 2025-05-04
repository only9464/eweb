var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = getApp(),
  o = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    timeConsumeQuota: "",
    dayConsumeQuota: "",
    nowTimeConsumeQuota: "",
    nowDayConsumeQuota: "",
    obj: {}
  },
  onLoad: function(t) {
    var a = wx.getStorageSync("funcPart"),
      n = {};
    a.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "changeQuota" == t.id && (n = t)
      }))
    })), wx.setNavigationBarTitle({
      title: o.t(n.id, {
        value: "en-US" != this.data.$_locale ? n.title : n.entitle
      })
    }), this.setData({
      nowTimeConsumeQuota: e.globalData.userInfo.onceTimeLimit / 100,
      nowDayConsumeQuota: e.globalData.userInfo.dayTotalLimit / 100,
      obj: n
    })
  },
  onChangeQuota: function() {
    var t = this.data,
      e = t.timeConsumeQuota,
      o = t.dayConsumeQuota;
    if (!a.$isDot(e) || !a.$isDot(o)) return wx.showModal({
      title: "温馨提示",
      content: "单次与累计免密额度未同时修改或金额含有小数点，请确认后重新输入！",
      showCancel: !1
    }), !1;
    var n = {
      onelimit: 100 * e,
      daylimit: 100 * o
    };
    a.$requestSync("POST", "/miniprogram/tradelimit", n, (function(t, e) {
      0 == e.retcode && a.$showModal("提示", "修改免密额度成功", "回首页")
    }))
  },
  getTimeConsumeQuota: function(t) {
    this.setData({
      timeConsumeQuota: t.detail.value
    })
  },
  getDayConsumeQuota: function(t) {
    this.setData({
      dayConsumeQuota: t.detail.value
    })
  }
});