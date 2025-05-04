var t = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(t) {
    this.getSrc(t.code)
  },
  getSrc: function() {
    var e = this,
      a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "tabbar";
    t.$requestSync("POST", "/epeortal/getEpeortalUrl", {}, (function(t, r) {
      if (0 == r.retcode) {
        var c = r.data.url,
          n = (r.data.type, wx.getStorageSync("token")),
          o = "".concat(c, "pages/h5/").concat(a, "?token=").concat(n.substr(7, n.length - 7), "&y=2024");
        e.setData({
          src: o
        })
      }
    }))
  }
});