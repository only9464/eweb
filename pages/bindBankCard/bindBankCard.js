var n = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  t = (0, n.getI18nInstance)();
(0, n.I18nPage)({
  data: {
    bankIconList: [{
      id: "ABC",
      url: "/style/images/bindBankCard/ABC.png",
      color: "#02956F"
    }, {
      id: "BOC",
      url: "/style/images/bindBankCard/BOC.png",
      color: "#CD2D41"
    }, {
      id: "BCM",
      url: "/style/images/bindBankCard/BOCOM.png",
      color: "#1D2087"
    }, {
      id: "CCB",
      url: "/style/images/bindBankCard/CCB.png",
      color: "#0066B3"
    }, {
      id: "ICBC",
      url: "/style/images/bindBankCard/ICBC.png",
      color: "#E50012"
    }, {
      id: "CMB",
      url: "/style/images/bindBankCard/CMB.png",
      color: "#E40012"
    }],
    bankList: []
  },
  onLoad: function(n) {
    this.getBankCardsList();
    var a = wx.getStorageSync("funcPart"),
      i = {};
    a.forEach((function(n) {
      n.funcList && n.funcList.forEach((function(n) {
        "bindBankCard" == n.id && (i = n)
      }))
    })), wx.setNavigationBarTitle({
      title: t.t(i.id, {
        value: "en-US" != this.data.$_locale ? i.title : i.entitle
      })
    })
  },
  toBankCardDetails: function(n) {
    var a = JSON.stringify(n.currentTarget.dataset.detail);
    console.log(a), wx.navigateTo({
      url: "/pages/unbundBankCards/unbundBankCards?str=" + a
    })
  },
  bindBankCards: function() {
    wx.navigateTo({
      url: "/pages/addBankCards/addBankCards"
    })
  },
  getBankCardsList: function() {
    var n = this;
    a.$requestSync("POST", "/miniprogram/querybankcards", {}, (function(a, t) {
      if (0 == t.retcode) {
        var i = t.data.data,
          r = n.data.bankIconList;
        i.forEach((function(n, a) {
          n.easybankcardno = n.bankcardno.substring(n.bankcardno.length - 4), r.forEach((function(a, t) {
            n.route == a.id && (n.url = a.url, n.color = a.color)
          }))
        })), n.setData({
          bankList: i
        })
      }
    }))
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
});