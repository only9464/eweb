var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  i = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    roomid: "",
    accountList: []
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      a = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "elecQueryHgc" == t.id && (a = t)
      }))
    })), wx.setNavigationBarTitle({
      title: i.t(a.id, {
        value: "en-US" != this.data.$_locale ? a.title : a.entitle
      })
    }), this.setData({
      accountList: wx.getStorageSync("elecAccountList") ? wx.getStorageSync("elecAccountList") : []
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
      content: "您的房间号不能为空",
      succuss: function(t) {}
    }), !1;
    var i = {
      elcsysid: "3",
      areaid: "1",
      roomid: t,
      buildid: "1"
    };
    e.$requestSync("POST", "/miniprogram/queryroominfo", i, (function(e, i) {
      "0" == i.retcode && wx.navigateTo({
        url: "/pages/elecharge/eleHgc?data=" + JSON.stringify(i.data) + "&roomid=" + t
      })
    }))
  }
});