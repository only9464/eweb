var r = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(t) {
    var a = this,
      e = t.url;
    r.$requestSync("POST", "/miniprogram/getschoolpayurl", {}, (function(r, t) {
      if (0 == t.retcode) {
        var s = t.data;
        a.setData({
          src: s + "?mpcode=" + e
        })
      }
    }))
  }
});