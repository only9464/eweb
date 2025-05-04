var e = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(r) {
    var a = this,
      t = r.url.replace(/\+/g, "%2B").replace(/\ /g, "%20").replace(/\=/g, "%3D").replace(/\//g, "%2F").replace(/\?/g, "%3F");
    e.$requestSync("POST", "/miniprogram/gettouchorderurl", {}, (function(e, r) {
      if (0 == r.retcode) {
        var c = r.data;
        a.setData({
          src: c + "?p=" + t
        }), console.log(a.data.src)
      }
    }))
  }
});