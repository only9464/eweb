var t = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(t) {
    this.getUrl()
  },
  getUrl: function() {
    var e = this;
    t.$requestSync("POST", "/ccb/getccburl", {}, (function(t, r) {
      if (0 == r.retcode) {
        var c = r.data;
        e.setData({
          src: c
        })
      }
    }))
  }
});