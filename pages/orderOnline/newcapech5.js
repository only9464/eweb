var t = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(a) {
    var c = this,
      e = a.url;
    "cgAppointment" != a.id ? t.$requestSync("POST", "/miniprogram/getnewcapecH5url", {}, (function(t, a) {
      if (0 == a.retcode) {
        var i = a.data;
        c.setData({
          src: "".concat(i).concat(i.indexOf("?") >= 0 ? "&" : "?", "p=").concat(e)
        })
      }
    })) : this.setData({
      src: "https://hub.17wanxiao.com/bsacs/light.action?flag=supwisdomEcard_hhdxcgyy&ecardFunc=index&p=" + e
    })
  }
});