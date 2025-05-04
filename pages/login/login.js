var s = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(e) {
    var a = e.code;
    this.setData({
      src: s.baseUrl + "/sso/login?code=" + a
    })
  }
});