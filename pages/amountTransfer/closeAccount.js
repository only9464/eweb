var t = require("@miniprogram-i18n/core"),
  n = getApp(),
  a = require("../../utils/request.js"),
  e = require("../../utils/bank.js").bankCardAttribution,
  o = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    accountinfo: {},
    type: "",
    bankcardno: "",
    flag: !1,
    canEnter: !1,
    show: !1,
    kkh: "",
    phone: "",
    timer: null
  },
  onLoad: function(t) {
    this.setTabbar(), this.init()
  },
  setTabbar: function() {
    var t = "closeAccountHs",
      a = wx.getStorageSync("funcPart"),
      e = {};
    a.forEach((function(n) {
      n.funcList && n.funcList.forEach((function(n) {
        n.id == t && (e = n)
      }))
    })), wx.setNavigationBarTitle({
      title: o.t(e.id, {
        value: "en-US" != this.data.$_locale ? e.title : e.entitle
      })
    }), this.setData({
      accountinfo: n.globalData.userInfo,
      type: t
    })
  },
  init: function() {
    var t = this;
    a.$requestSync("POST", "/miniprogram/checkIsCanCloseAccount", {}, (function(n, a) {
      if (0 == a.retcode) {
        var e = !!a.data && a.data.needbankcard;
        t.setData({
          flag: e,
          show: e
        })
      }
    }))
  },
  change: function(t) {
    console.log(t), this.setData({
      canEnter: t.detail
    })
  },
  close: function(t) {
    t.detail.isConfirm ? this.data.canEnter ? this.setData({
      show: t.detail.show
    }) : wx.showToast({
      title: "请先阅读并同意",
      icon: "none"
    }) : wx.switchTab({
      url: "/pages/index/index"
    })
  },
  start: function() {
    var t = this.data,
      n = t.flag,
      e = t.bankcardno,
      o = t.kkh,
      i = t.phone,
      c = this;
    if (n) {
      if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(e)) return wx.showToast({
        title: "请输入正确的银行卡号",
        icon: "none"
      }), !1;
      if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(i)) return wx.showToast({
        title: "请输入正确的手机号",
        icon: "none"
      }), !1;
      var s = {
        bankcardno: e,
        phone: i,
        kkh: o
      };
      a.$requestSync("POST", "/miniprogram/uploadHsBankCard", s, (function(t, n) {
        0 == n.retcode && c.closeAccount()
      }))
    } else c.closeAccount()
  },
  closeAccount: function() {
    a.$requestSync("POST", "/miniprogram/closeAccount", {}, (function(t, n) {
      0 == n.retcode && a.$showModal("提示", n.retmsg, "回首页")
    }))
  },
  getBankCardno: function(t) {
    var n = this;
    clearTimeout(this.data.timer);
    var a = t.detail.value;
    this.data.timer = setTimeout((function() {
      var t = e(a);
      console.log(t), n.setData({
        bankcardno: a,
        kkh: "error" != t ? t.bankName : ""
      })
    }), 500)
  },
  getPhone: function(t) {
    var n = t.detail.value;
    this.setData({
      phone: n
    })
  }
});