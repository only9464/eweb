var t = require("../../utils/request.js");
Page({
  data: {
    detail: {},
    name: "",
    percent: 0
  },
  onLoad: function(t) {
    this.setData({
      name: t.name
    }), this.getDetail(t.id)
  },
  getDetail: function(e) {
    var a = this,
      i = {
        id: e
      };
    t.$requestSync("POST", "/miniprogram/getShowerInfo", i, (function(t, e) {
      if (0 == e.retcode) {
        var i = e.data;
        a.setData({
          percent: (e.data.inuse / e.data.total * 100).toFixed(2),
          detail: i
        })
      }
    }))
  }
});