var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = require("../../utils/util.js"),
  n = (0, t.getI18nInstance)();
Component({
  behaviors: [t.I18n],
  properties: {
    showTurnoverFilter: {
      type: Boolean,
      value: ""
    }
  },
  options: {
    addGlobalClass: !0
  },
  data: {
    loadingText: "加载中...",
    isFilterMonth: !0,
    isFilterKinds: !0,
    recharge: 0,
    consume: 0,
    pageno: 1,
    fliterDate: (new Date).getFullYear() + "-" + ((new Date).getMonth() + 1 >= 10 ? (new Date).getMonth() + 1 : "0" + ((new Date).getMonth() + 1)),
    minDate: (new Date).getFullYear() - 1 + "-" + ((new Date).getMonth() + 1 >= 10 ? (new Date).getMonth() + 1 : "0" + ((new Date).getMonth() + 1)),
    maxDate: (new Date).getFullYear() + "-" + ((new Date).getMonth() + 1 >= 10 ? (new Date).getMonth() + 1 : "0" + ((new Date).getMonth() + 1)),
    month: "本",
    enmonth: "Now",
    filterItems: [{
      id: 0,
      value: "充值",
      selected: !1
    }, {
      id: 1,
      value: "消费",
      selected: !1
    }, {
      id: 2,
      value: "缴费",
      selected: !1
    }, {
      id: 3,
      value: "电费",
      selected: !1
    }, {
      id: 4,
      value: "网费",
      selected: !1
    }, {
      id: 5,
      value: "水费",
      selected: !1
    }, {
      id: 6,
      value: "班车",
      selected: !1
    }],
    list: [],
    scrollTop: "",
    type: wx.getStorageSync("ssltype"),
    isShowSummary: !0
  },
  pageLifetimes: {
    hide: function() {
      this.setData({
        pageno: 1,
        loadingText: "加载中...",
        list: [],
        scrollTop: 0,
        consume: 0,
        recharge: 0
      })
    },
    show: function() {
      this.getPayList()
    },
    resize: function(t) {}
  },
  methods: {
    toSummary: function() {
      wx.navigateTo({
        url: "/pages/turnover/summary"
      })
    },
    toEvaluation: function(t) {
      var e = t.currentTarget.dataset.item,
        a = {};
      a.refno = e.refno, a.shopaccno = e.shopaccno, a.shopname = e.shopname, wx.navigateTo({
        url: "/pages/evaluate/list?data=" + JSON.stringify(a)
      })
    },
    chooseMonth: function() {
      this.setData({
        isFilterMonth: !this.data.isFilterMonth
      })
    },
    bindDateChange: function(t) {
      console.log(t);
      var e = t.detail.value,
        n = (e.substr(0, 4), e.substr(5, 2));
      this.setData({
        isFilterMonth: !this.data.isFilterMonth,
        month: n,
        fliterDate: e,
        list: [],
        pageno: 1,
        enmonth: a.getEnMonth(e),
        consume: 0,
        recharge: 0
      }), this.getPayList()
    },
    getPayList: function() {
      var t = this;
      t.setData({
        loadingText: n.t("loading")
      });
      var o = t.data.fliterDate;
      console.log(t.data.maxDate, t.data.minDate);
      var i = a.startFormatDate1(o),
        s = a.endFormatDate1(o),
        r = t.data.pageno,
        l = {
          startdate: i,
          enddate: s,
          pageno: r,
          pagesize: 5
        };
      e.$requestSync("POST", "/miniprogram/getbilldata", l, (function(e, a) {
        if (0 == a.retcode) {
          var o = a.data.data.totlist ? a.data.data.totlist : [];
          o.length ? o.forEach((function(e) {
            1 == e.tradetype ? t.setData({
              recharge: Math.abs(e.tot).toFixed(2)
            }) : 2 == e.tradetype && t.setData({
              consume: Math.abs(e.tot).toFixed(2)
            })
          })) : t.setData({
            consume: 0,
            recharge: 0
          });
          var i = a.data.data.list;
          if (i) {
            var s = [];
            i.forEach((function(t, e) {
              t.routeinfo || (t.routeinfo = "账户余额"), t.fh = t.amount > 0 ? "+" : "-", t.amount = Math.abs(t.amount).toFixed(2), t.paytime = t.paytime.substr(0, 4) + "-" + t.paytime.substr(4, 2) + "-" + t.paytime.substr(6, 2) + " " + t.paytime.substr(8, 2) + ":" + t.paytime.substr(10, 2), t.managefee = Math.abs(t.managefee).toFixed(2), s.push(t)
            }));
            var r = t.data.list.concat(s);
            t.setData({
              list: r,
              totalPage: a.data.data.totalPage
            }), i.length < 5 && t.setData({
              loadingText: n.t("nomore")
            })
          } else t.setData({
            loadingText: n.t("nomore")
          })
        }
      }))
    },
    cancel: function() {
      this.setData({
        isFilterMonth: !this.data.isFilterMonth
      })
    },
    getTurnoverList: function() {
      var t = this.data,
        e = t.totalPage,
        a = t.pageno;
      a < e ? (this.setData({
        pageno: a + 1
      }), this.getPayList()) : this.setData({
        loadingText: n.t("nomore")
      })
    }
  }
});