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
    fliterDate: (new Date).getFullYear() + "-" + ((new Date).getMonth() + 1 >= 10 ? (new Date).getMonth() + 1 : "0" + ((new Date).getMonth() + 1)),
    minDate: (new Date).getFullYear() - 1 + "-" + ((new Date).getMonth() + 1 >= 10 ? (new Date).getMonth() + 1 : "0" + ((new Date).getMonth() + 1)),
    maxDate: (new Date).getFullYear() + "-" + ((new Date).getMonth() + 1 >= 10 ? (new Date).getMonth() + 1 : "0" + ((new Date).getMonth() + 1)),
    month: "本",
    pageno: 1,
    list: [],
    scrollTop: "",
    enmonth: "Now",
    type: wx.getStorageSync("ssltype")
  },
  pageLifetimes: {
    hide: function() {
      this.setData({
        pageno: 1,
        loadingText: "加载中...",
        list: [],
        scrollTop: 0
      })
    },
    show: function() {
      this.getAuthList()
    },
    resize: function(t) {}
  },
  methods: {
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
        enmonth: a.getEnMonth(e)
      }), this.getAuthList()
    },
    getAuthList: function() {
      var t = this;
      t.setData({
        loadingText: n.t("loading")
      });
      var i = t.data.fliterDate;
      console.log(t.data.maxDate, t.data.minDate);
      var o = a.startFormatDate1(i),
        s = a.endFormatDate1(i),
        r = t.data.pageno,
        l = {
          startdate: o,
          enddate: s,
          pageno: r,
          pagesize: 5
        };
      e.$requestSync("POST", "/miniprogram/querymydoordtl", l, (function(e, a) {
        if (0 == a.retcode) {
          var i = a.data.data.list;
          if (i) {
            i.forEach((function(t) {
              t.authtime = t.authtime.substr(0, 4) + "-" + t.authtime.substr(4, 2) + "-" + t.authtime.substr(6, 2) + " " + t.authtime.substr(8, 2) + ":" + t.authtime.substr(10, 2)
            }));
            var o = t.data.list.concat(i);
            t.setData({
              list: o,
              totalPage: a.data.data.totalPage
            }), i.length < 5 && t.setData({
              loadingText: n.t("nomore")
            })
          } else t.setData({
            loadingText: n.t("nomore")
          })
        } else t.setData({
          loadingText: n.t("nomore")
        })
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
      }), this.getAuthList()) : this.setData({
        loadingText: n.t("nomore")
      })
    }
  }
});