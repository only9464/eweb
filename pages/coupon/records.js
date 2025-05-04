var t = require("../../utils/request.js");
Page({
  data: {
    startdate: "请选择",
    enddate: "请选择",
    status: "0",
    statusList: [{
      name: "全部",
      id: ""
    }, {
      name: "已领取",
      id: "init"
    }, {
      name: "已使用",
      id: "used"
    }, {
      name: "已失效",
      id: "invalid"
    }],
    list: [],
    height: 0,
    loadingText: "暂无更多",
    pageno: 1,
    pagesize: 5,
    totalPage: 1,
    statusFormat: {
      init: "可使用",
      used: "已使用",
      invalid: "已失效"
    }
  },
  onLoad: function() {
    this.getScrollViewHeight(), this.getList()
  },
  query: function() {
    this.setData({
      pageno: 1,
      totalPage: 1,
      list: []
    }), this.getList()
  },
  getList: function() {
    var a = this,
      e = this,
      i = e.data,
      s = i.startdate,
      n = i.enddate,
      o = i.pageno,
      c = i.pagesize,
      r = i.status,
      d = i.statusList,
      l = {
        pageno: o,
        pagesize: c,
        startdate: "请选择" == s ? "" : s.replace(/-/g, ""),
        enddate: "请选择" == n ? "" : n.replace(/-/g, ""),
        status: d[r].id
      };
    t.$requestSync("POST", "/coupon/list", l, (function(t, i) {
      if ("0" == i.retcode) {
        var s = i.data.list || [];
        s.forEach((function(t) {
          t.date = t.endDate === t.startDate ? "".concat(a.formatDateOrTime(t.startDate), " ").concat(a.formatDateOrTime(t.startTime, "time"), "-").concat(a.formatDateOrTime(t.endTime, "time")) : "".concat(a.formatDateOrTime(t.startDate), "-").concat(a.formatDateOrTime(t.endDate), " ").concat(a.formatDateOrTime(t.startTime, "time"), "-").concat(a.formatDateOrTime(t.endTime, "time")), t.limit = 0 == t.limitVal ? "任意金额使用" : "满".concat(t.limitVal, "元可用")
        })), s = e.data.list.concat(s), e.setData({
          list: s,
          totalPage: i.data.totalPage,
          loadingText: 0 == s.length ? "暂无更多" : "加载更多"
        })
      } else e.setData({
        loadingText: "暂无更多"
      })
    }))
  },
  getMoreList: function() {
    var t = this.data,
      a = t.totalPage,
      e = t.pageno;
    e < a ? (this.setData({
      pageno: e + 1
    }), this.getList()) : this.setData({
      loadingText: "暂无更多"
    })
  },
  getScrollViewHeight: function() {
    var t = wx.createSelectorQuery().in(this),
      a = this;
    t.select(".records-condition").boundingClientRect().exec((function(t) {
      var e = wx.getSystemInfoSync().windowHeight;
      a.setData({
        height: "calc( ".concat(e, "px - ").concat(t[0].height, "px - 40rpx )")
      })
    }))
  },
  formatDateOrTime: function(t) {
    var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "date";
    return "time" == a ? "".concat(t.substr(0, 2), ":").concat(t.substr(2, 2)) : "".concat(t.substr(0, 4), "/").concat(t.substr(4, 2), "/").concat(t.substr(6, 2))
  },
  getStartdate: function(t) {
    this.setData({
      startdate: t.detail.value
    })
  },
  getEnddate: function(t) {
    this.setData({
      enddate: t.detail.value
    })
  },
  getStatus: function(t) {
    this.setData({
      status: t.detail.value
    })
  }
});