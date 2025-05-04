var r = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(e) {
    var t = this,
      a = e.url;
    r.$requestSync("POST", "/miniprogram/getwaterorderurl", {}, (function(r, e) {
      if (0 == e.retcode) {
        var s = e.data;
        t.setData({
          src: s + "?code=" + a
        }), console.log(t.data.src)
      }
    }))
  }
});