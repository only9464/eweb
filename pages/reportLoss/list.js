var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    list: [],
    pageSize: 15,
    pageNo: 1,
    totalPages: 1,
    searchVal: ""
  },
  onLoad: function() {
    var t = wx.getStorageSync("funcPart") || [],
      a = {};
    t.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "getLossCard" == t.id && (a = t)
      }))
    })), wx.setNavigationBarTitle({
      title: e.t(a.id, {
        value: "en-US" != this.data.$_locale ? a.title : a.entitle
      })
    }), this.getList()
  },
  change: function(t) {
    var a = t.detail.value;
    this.setData({
      searchVal: a
    })
  },
  query: function() {
    this.setData({
      pageNo: 1,
      totalPages: 1,
      list: []
    }), this.getList()
  },
  getList: function() {
    var t = this,
      e = {
        pageno: this.data.pageNo,
        pagesize: this.data.pageSize,
        stuempno: this.data.searchVal
      };
    a.$requestSync("POST", "/miniprogram/getlostcarddtls", e, (function(a, e) {
      if (a && 0 == e.retcode) {
        var i = e.data.list || [];
        t.setData({
          pageNo: e.data.pageNo,
          totalPages: e.data.totalPage,
          list: t.data.list.concat(i)
        })
      }
    }))
  },
  getmore: function() {
    var t = this.data,
      a = t.pageNo;
    a < t.totalPages && (this.setData({
      pageNo: a + 1
    }), this.getList())
  }
});