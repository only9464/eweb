var t = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(e) {
    var a = this,
      c = wx.getStorageSync("user").stuempno;
    t.$requestSync("POST", "/miniprogram/getRepairUrl", {}, (function(t, e) {
      if (0 == e.retcode) {
        var r = e.data;
        a.setData({
          src: r.indexOf("?") > 0 ? "".concat(r, "&code=").concat(c) : "".concat(r, "?code=").concat(c)
        })
      }
    }))
  }
});