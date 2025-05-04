var t = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(t) {
    this.getSrc()
  },
  getSrc: function() {
    var e = this;
    t.$requestSync("POST", "/epeortal/getEpeortalUrl", {}, (function(t, a) {
      if (0 == a.retcode) {
        var r = a.data.url,
          c = (a.data.type, wx.getStorageSync("token")),
          s = "".concat(r, "pages/h5/summary?token=").concat(c.substr(7, c.length - 7));
        e.setData({
          src: s
        })
      }
    }))
  }
});