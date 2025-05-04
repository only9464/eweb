var t = require("@miniprogram-i18n/core"),
  a = (0, t.getI18nInstance)(),
  e = require("../../utils/request.js");
(0, t.I18nPage)({
  data: {
    roomid: "",
    show: !0,
    accountList: []
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      i = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "waterPay" == t.id && (i = t)
      }))
    })), wx.setNavigationBarTitle({
      title: a.t(i.id, {
        value: "en-US" != this.data.$_locale ? i.title : i.entitle
      })
    }), this.setData({
      accountList: wx.getStorageSync("waterAccountList") ? wx.getStorageSync("waterAccountList") : []
    })
  },
  getRoomid: function(t) {
    this.setData({
      roomid: t.detail.value
    })
  },
  setAccount: function(t) {
    this.setData({
      roomid: t.currentTarget.dataset.account
    })
  },
  doNext: function() {
    var t = this.data.roomid;
    if (e.$isEmpty(t)) return wx.showModal({
      title: "错误",
      content: "您的查询账号不能为空",
      succuss: function(t) {}
    }), !1;
    var a = {
      elcsysid: "2",
      areaid: "2",
      roomid: t,
      buildid: "1"
    };
    e.$requestSync("POST", "/miniprogram/queryroominfo", a, (function(a, e) {
      "0" == e.retcode && wx.navigateTo({
        url: "/pages/elecharge/waterCharge?data=" + JSON.stringify(e.data) + "&roomid=" + t
      })
    }))
  }
});