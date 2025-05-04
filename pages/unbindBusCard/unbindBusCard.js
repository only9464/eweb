var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = require("../../utils/util.js"),
  n = require("../../utils/throttle.js"),
  i = (0, t.getI18nInstance)(),
  r = getApp();
(0, t.I18nPage)({
  data: {
    cost_list: [],
    balance: "0.00",
    is_have_card: !0,
    info: null,
    src: a.baseUrl.substr(0, a.baseUrl.lastIndexOf("/")) + "/cardsurface/card.png"
  },
  onLoad: function(t) {
    var a = wx.getStorageSync("funcPart"),
      e = {};
    a.forEach((function(t) {
      t.funcList.forEach((function(t) {
        "unbindBusCard" == t.id && (e = t)
      }))
    })), wx.setNavigationBarTitle({
      title: i.t(e.id, {
        value: "en-US" != this.data.$_locale ? e.title : e.entitle
      })
    }), this.get_card_info()
  },
  get_cost_list: function() {
    var t = this,
      n = {
        startdate: e.formatDate(new Date((new Date).getFullYear() - 1, 0, 1)),
        enddate: e.formatDate(new Date),
        pageno: 1,
        pagesize: 3
      };
    a.$requestSync("POST", "/miniprogram/getbilldata", n, (function(a, e) {
      if ("0" == e.retcode) {
        var n = e.data.data.list;
        n.forEach((function(t) {
          t._amount = Math.abs(t.amount).toFixed(2), t._paytime = t.paytime.substr(0, 4) + "-" + t.paytime.substr(4, 2) + "-" + t.paytime.substr(6, 2) + " " + t.paytime.substr(8, 2) + ":" + t.paytime.substr(10, 2) + ":" + t.paytime.substr(12, 2)
        })), t.setData({
          cost_list: n
        })
      }
    }))
  },
  get_card_info: function() {
    var t = this;
    a.$requestSync("POST", "/miniprogram/common/getactivenfccard", {}, (function(a, e) {
      if (console.log(e), "0" == e.retcode) {
        var n = e.data ? e.data.data[0] : "";
        n && (n._cardno = n.cardno.substr(-4), t.get_cost_list(), t.setData({
          is_have_card: !1,
          balance: r.globalData.userInfo.balance,
          info: n
        }))
      }
    }))
  },
  unbind: n.throttle((function() {
    var t = this;
    wx.showModal({
      title: "提示",
      content: "解绑后此卡仅作为普通交通卡使用\n如需再使用联名卡,请重新开通",
      confirmColor: "#A2A2A2",
      cancelColor: "#4AA3FB",
      confirmText: "解绑",
      success: function(e) {
        if (e.confirm) {
          var n = {
            id: t.data.info.id
          };
          a.$requestSync("POST", "/miniprogram/common/unbindfmshnfccard", n, (function(t, a) {
            console.log(a), "0" == a.retcode && wx.$showModal("提示", "解绑成功", "返回首页")
          }))
        }
      }
    })
  }), 2e3)
});