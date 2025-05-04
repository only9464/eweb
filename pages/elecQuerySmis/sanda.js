var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    roomid: "",
    accountList: [],
    systemIndex: "",
    elesystem: []
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      i = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "elecQuerySanda" == t.id && (i = t)
      }))
    })), this.getEleSystem(), wx.setNavigationBarTitle({
      title: a.t(i.id, {
        value: "en-US" != this.data.$_locale ? i.title : i.entitle
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
  bindSystemChange: function(t) {
    console.log(t);
    var e = t.detail.value;
    this.setData({
      systemIndex: e,
      elcsysid: this.data.elesystem[e].elcsysid
    })
  },
  getEleSystem: function(t) {
    var a = this;
    a.setData({
      elesystem: []
    }), e.$requestSync("POST", "/miniprogram/queryelcsystem", {}, (function(t, e) {
      console.log(e), "0" == e.retcode && (e = e.data, a.setData({
        elesystem: e.data
      }))
    }))
  },
  doNext: function() {
    var t = this.data,
      a = t.roomid,
      i = t.elcsysid;
    if (e.$isEmpty(a)) return wx.showModal({
      title: "错误",
      content: "您的房间号不能为空",
      succuss: function(t) {}
    }), !1;
    var s = {
      elcsysid: i,
      areaid: "1",
      roomid: a,
      buildid: "1"
    };
    e.$requestSync("POST", "/miniprogram/queryroominfo", s, (function(t, e) {
      "0" == e.retcode && wx.navigateTo({
        url: "/pages/elecharge/eleHgc?data=" + JSON.stringify(e.data) + "&roomid=" + a
      })
    }))
  }
});