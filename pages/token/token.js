var e = require("../../utils/request.js");
Page({
  data: {},
  onLoad: function() {
    e.$getToken().then((function(e) {
      wx.reLaunch({
        url: "/pages/index/index"
      })
    }))
  }
});