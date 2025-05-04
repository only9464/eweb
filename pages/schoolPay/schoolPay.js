var o = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(r) {
    var a = this,
      e = r.url;
    console.log(e), o.$requestSync("POST", "/miniprogram/getschoolpayurl", {}, (function(o, r) {
      if (0 == r.retcode) {
        var s = r.data;
        console.log(r), a.setData({
          src: s + "?q=" + e
        }), console.log(a.data.src)
      }
    }))
  }
});