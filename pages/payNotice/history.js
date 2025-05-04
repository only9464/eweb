var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = (0, t.getI18nInstance)();
getApp();
(0, t.I18nPage)({
  data: {
    pageno: 1,
    totalPage: 1,
    loadingText: "暂无更多",
    list: []
  },
  onLoad: function(t) {
    wx.setNavigationBarTitle({
      title: e.t("payNotice_history")
    }), this.getList()
  },
  getList: function() {
    var t = this,
      i = t.data.pageno,
      o = {
        pageno: i,
        pagesize: 5,
        status: 2
      };
    a.$requestSync("POST", "/miniprogram/getMyFeedtl", o, (function(a, i) {
      if ("0" == i.retcode) {
        var o = i.data.data.list;
        if (0 == o.length) t.setData({
          loadingText: e.t("nomore")
        });
        else {
          var n = [];
          o.forEach((function(t, a) {
            t.amount = Math.abs(t.amount).toFixed(2), n.push(t)
          }));
          var s = t.data.list.concat(n);
          t.setData({
            list: s,
            totalPage: i.data.data.totalPage
          }), o.length < 5 && t.setData({
            loadingText: e.t("nomore")
          })
        }
      }
    }))
  },
  getMoreList: function() {
    var t = this.data,
      a = t.totalPage,
      i = t.pageno;
    i < a ? (this.setData({
      pageno: i + 1
    }), this.getList()) : this.setData({
      loadingText: e.t("nomore")
    })
  }
});