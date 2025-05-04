var a = require("@miniprogram-i18n/core"),
  n = require("../../utils/request.js"),
  t = getApp(),
  e = (0, a.getI18nInstance)();
(0, a.I18nPage)({
  data: {
    bankCardno: "",
    bankIndex: 0,
    bankCardsList: [],
    bankCode: "",
    username: ""
  },
  onLoad: function(a) {
    var n = wx.getStorageSync("funcPart"),
      i = {};
    n.forEach((function(a) {
      a.funcList && a.funcList.forEach((function(a) {
        "bindBankCard" == a.id && (i = a)
      }))
    })), this.setData({
      obj: i
    }), wx.setNavigationBarTitle({
      title: e.t("add_bankcard")
    }), this.getCanUseBank(), this.setData({
      username: t.globalData.userInfo.username
    })
  },
  getBankCardno: function(a) {
    this.setData({
      bankCardno: a.detail.value
    })
  },
  getCanUseBank: function() {
    var a = this;
    n.$requestSync("POST", "/miniprogram/getbanks", {}, (function(n, t) {
      if (0 == t.retcode) {
        var e = t.data.data,
          i = [];
        e.forEach((function(a) {
          "wxPay" == a.bankcode || "alipay" == a.bankcode || "wechat" == a.bankcode || i.push(a)
        })), a.setData({
          bankCardsList: i
        })
      }
    }))
  },
  bindCardsChange: function(a) {
    this.setData({
      bankIndex: a.detail.value,
      bankCode: this.data.bankCardsList[a.detail.value].bankcode
    })
  },
  bindBankCards: function() {
    var a = {
      bankcode: this.data.bankCode,
      bankcardno: this.data.bankCardno
    };
    console.log(a), n.$requestSync("POST", "/miniprogram/bindbankcard", a, (function(a, t) {
      0 == t.retcode && n.$showModal("提示", t.retmsg, "回首页")
    }))
  }
});