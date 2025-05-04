var t = require("../../utils/request.js"),
  a = require("../../utils/util.js"),
  e = require("../../utils/throttle.js"),
  i = getApp();
Page({
  data: {
    cost_list: [],
    balance: "0.00",
    is_have_card: !0,
    info: null
  },
  onLoad: function(t) {
    this.get_card_info()
  },
  get_cost_list: function() {
    var e = this,
      i = {
        startdate: a.formatDate(new Date((new Date).getFullYear() - 1, 0, 1)),
        enddate: a.formatDate(new Date),
        pageno: 1,
        pagesize: 3
      };
    t.$requestSync("POST", "/miniprogram/getbilldata", i, (function(t, a) {
      if ("0" == a.retcode) {
        var i = a.data.data.list;
        i.forEach((function(t) {
          t._amount = Math.abs(t.amount).toFixed(2), t._paytime = t.paytime.substr(0, 4) + "-" + t.paytime.substr(4, 2) + "-" + t.paytime.substr(6, 2) + " " + t.paytime.substr(8, 2) + ":" + t.paytime.substr(10, 2) + ":" + t.paytime.substr(12, 2)
        })), e.setData({
          cost_list: i
        })
      }
    }))
  },
  get_card_info: function() {
    var a = this;
    t.$requestSync("POST", "/miniprogram/common/getactivenfccard", {}, (function(t, e) {
      if (console.log(e), "0" == e.retcode) {
        var n = e.data ? e.data.data[0] : "";
        n && (n._cardno = n.cardno.substr(-4), a.get_cost_list(), a.setData({
          is_have_card: !1,
          balance: i.globalData.userInfo.balance,
          info: n
        }))
      }
    }))
  },
  unbind: e.throttle((function() {
    var a = this;
    wx.showModal({
      title: "提示",
      content: "解绑后此卡仅作为普通交通卡使用\n解绑后如需绑定新的虚拟交通卡,需等待3天(绑定原来的虚拟交通卡不受影响)",
      confirmColor: "#A2A2A2",
      cancelColor: "#4AA3FB",
      confirmText: "解绑",
      success: function(e) {
        if (e.confirm) {
          var i = {
            id: a.data.info.id
          };
          t.$requestSync("POST", "/miniprogram/common/unbindfmshnfccard", i, (function(t, a) {
            console.log(a), "0" == a.retcode && wx.$showModal("提示", "解绑成功", "返回首页")
          }))
        }
      }
    })
  }), 2e3)
});