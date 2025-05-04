var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js");
(0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    loadingText: "加载中",
    consume: "",
    list: [],
    totalPage: 1,
    pageno: 1,
    user: {},
    startdate: "",
    enddate: "",
    height: ""
  },
  onLoad: function() {
    this.getScrollViewHeight();
    var t = wx.getStorageSync("user");
    this.setData({
      startdate: this.timeFormat((new Date).getTime() - 12096e5, !0),
      enddate: this.timeFormat((new Date).getTime(), !0),
      user: t
    }), this.getDtl(t.stuempno)
  },
  getScrollViewHeight: function() {
    var t = wx.createSelectorQuery().in(this),
      e = this;
    t.select(".topbox").boundingClientRect().exec((function(t) {
      var a = wx.getSystemInfoSync().windowHeight;
      e.setData({
        height: "calc( ".concat(a, "px - ").concat(t[0].height, "px - 80rpx )")
      })
    }))
  },
  query: function() {
    this.setData({
      list: [],
      pageno: 1,
      totalPage: 1,
      loadingText: "加载中"
    }), this.getDtl(this.data.user.stuempno)
  },
  getDtl: function(t) {
    var a = this,
      i = a.data,
      n = i.startdate,
      s = i.enddate,
      o = {
        stuempno: t,
        pageno: i.pageno,
        pagesize: 5,
        startdate: n ? n.replace(/-/g, "") : "",
        enddate: s ? s.replace(/-/g, "") : ""
      };
    e.$requestSync("POST", "/miniprogram/getEpidemicSignDtl", o, (function(t, e) {
      if ("0" == e.retcode) {
        var i = e.data.list;
        i.length && i.forEach((function(t) {
          t.date = a.timeFormat(t.submittime), t.flag = -1 !== t.triptype.indexOf("旅途中")
        })), i = a.data.list.concat(i), a.setData({
          list: i,
          totalPage: e.data.totalPage,
          loadingText: "加载更多"
        })
      } else a.setData({
        loadingText: "暂无更多"
      })
    }))
  },
  getMoreList: function() {
    var t = this.data,
      e = t.totalPage,
      a = t.pageno;
    a < e ? (this.setData({
      pageno: a + 1
    }), this.getDtl(this.data.user.stuempno)) : this.setData({
      loadingText: "暂无更多"
    })
  },
  timeFormat: function(t, e) {
    console.log(t);
    var a = new Date(parseInt(t)),
      i = a.getFullYear(),
      n = this.isOutTen(a.getMonth() + 1),
      s = this.isOutTen(a.getDate()),
      o = this.isOutTen(a.getHours()),
      g = this.isOutTen(a.getMinutes()),
      r = this.isOutTen(a.getSeconds());
    return e ? [i, n, s].join("-") : [i, n, s].join("-") + " " + [o, g, r].join(":")
  },
  isOutTen: function(t) {
    return t < 10 ? "0" + t : t
  },
  getStartdate: function(t) {
    this.setData({
      startdate: t.detail.value
    }), console.log(t)
  },
  getEnddate: function(t) {
    this.setData({
      enddate: t.detail.value
    })
  }
});