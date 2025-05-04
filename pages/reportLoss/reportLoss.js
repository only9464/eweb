var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  s = getApp(),
  n = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    openCardKindsPop: !1,
    columns: [],
    cardsKind: "请选择卡片类型",
    cardStatus: !1,
    status: !1,
    id: "",
    type: "",
    idAppidList: ["wx2ffd1318c95146e0"],
    showIdDesc: !1,
    toastMsg: ""
  },
  onLoad: function(t) {
    var a = wx.getStorageSync("funcPart"),
      i = {};
    a.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "reportLoss" == t.id && (i = t)
      }))
    })), wx.setNavigationBarTitle({
      title: n.t(i.id, {
        value: "en-US" != this.data.$_locale ? i.title : i.entitle
      })
    }), this.getCardMsg(), this.setData({
      id: s.globalData.userInfo.stuempno,
      type: wx.getStorageSync("ssltype"),
      showIdDesc: this.data.idAppidList.includes(wx.getAccountInfoSync().miniProgram.appId)
    })
  },
  getCardMsg: function() {
    var t = this;
    a.$requestSync("POST", "/miniprogram/getlosscards", {}, (function(s, n) {
      var i = n.data || [];
      i.length ? t.setData({
        columns: i,
        cardsKind: i[0].text,
        cardStatus: i[0].lossflag,
        cardId: i[0].cardphyid
      }) : a.$showModal("提示", "未开通实体卡", "回首页"), "1" == n.sk && t.setData({
        toastMsg: n.retmsg || ""
      })
    }))
  },
  openCardKinds: function() {
    this.data.columns.length > 1 ? this.setData({
      openCardKindsPop: !0
    }) : wx.showToast({
      title: "没有更多选项",
      duration: 2e3,
      icon: "none"
    })
  },
  loss_or_find: function() {
    var t = this.data.cardStatus,
      s = {
        pwd: "",
        cardphyid: this.data.cardId
      };
    0 == t ? a.$requestSync("POST", "/miniprogram/cardloss", s, (function(t, s) {
      0 == s.retcode && a.$showModal("提示", "挂失成功", "回首页")
    })) : a.$requestSync("POST", "/miniprogram/cardunloss", s, (function(t, s) {
      0 == s.retcode && a.$showModal("提示", "解挂成功", "回首页")
    }))
  },
  bindPickerChange: function(t) {
    var a = t.detail.value,
      s = this.data.columns;
    this.setData({
      cardsKind: s[a].text,
      cardStatus: s[a].lossflag
    })
  }
});