var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    loadingText: "加载中",
    consume: "",
    list: [],
    totalPage: 1,
    pageno: 1,
    user: wx.getStorageSync("user")
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: e.t("arrears")
    }), this.getList()
  },
  getList: function() {
    var t = this,
      s = t.data.pageno,
      i = {
        pageno: s,
        pagesize: 5
      };
    a.$requestSync("POST", "/miniprogram/getArrearsBillData", i, (function(a, s) {
      if ("0" == s.retcode) {
        var i = s.data.data.totlist ? s.data.data.totlist : [];
        i.length && t.setData({
          consume: Math.abs(i[0].tot).toFixed(2)
        });
        var o = s.data.data.list;
        if (o) {
          var r = [];
          o.forEach((function(t, a) {
            t.amount = Math.abs(t.amount).toFixed(2), t.routeinfo = "账户余额", t.paytime = t.paytime.substr(0, 4) + "-" + t.paytime.substr(4, 2) + "-" + t.paytime.substr(6, 2) + " " + t.paytime.substr(8, 2) + ":" + t.paytime.substr(10, 2) + ":" + t.paytime.substr(12, 2), r.push(t)
          }));
          var n = t.data.list.concat(r);
          t.setData({
            list: n,
            totalPage: s.data.data.totalPage
          }), o.length < 5 && t.setData({
            loadingText: e.t("nomore")
          })
        } else t.setData({
          loadingText: e.t("nomore")
        })
      }
    }))
  },
  getTurnoverList: function() {
    var t = this.data,
      a = t.totalPage,
      s = t.pageno;
    s < a ? (this.setData({
      pageno: s + 1
    }), this.getList()) : this.setData({
      loadingText: e.t("nomore")
    })
  }
});