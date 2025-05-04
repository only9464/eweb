var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = (0, t.getI18nInstance)();
getApp();
(0, t.I18nPage)({
  data: {
    height: "",
    pageno: 1,
    totalPage: 1,
    loadingText: "暂无更多",
    list: []
  },
  onLoad: function(t) {
    this.getNaviHeight(), this.initNaviBar()
  },
  initNaviBar: function() {
    var t = wx.getStorageSync("funcPart"),
      a = {};
    t.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "payNotice" == t.id && (a = t)
      }))
    })), this.getList(), wx.setNavigationBarTitle({
      title: e.t(a.id, {
        value: "en-US" != this.data.$_locale ? a.title : a.entitle
      })
    })
  },
  toPay: function(t) {
    var a = t.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/payNotice/pay?data=" + JSON.stringify(a)
    })
  },
  getList: function() {
    var t = this,
      i = t.data.pageno,
      n = {
        pageno: i,
        pagesize: 5,
        status: 1
      };
    a.$requestSync("POST", "/miniprogram/getMyFeedtl", n, (function(a, i) {
      if ("0" == i.retcode) {
        var n = i.data.data.list;
        if (0 == n.length) t.setData({
          loadingText: e.t("nomore")
        });
        else {
          var o = [];
          n.forEach((function(t, a) {
            t.amount = Math.abs(t.amount).toFixed(2), o.push(t)
          }));
          var s = t.data.list.concat(o);
          t.setData({
            list: s,
            totalPage: i.data.data.totalPage
          }), n.length < 5 && t.setData({
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
  },
  back: function() {
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  toHistory: function() {
    wx.navigateTo({
      url: "/pages/payNotice/history"
    })
  },
  getNaviHeight: function() {
    var t, a = wx.getSystemInfoSync();
    console.log(a), a && a.system && (t = a.system.indexOf("Android") > 0 ? 48 : 44, this.setData({
      height: t + a.statusBarHeight
    }))
  }
});