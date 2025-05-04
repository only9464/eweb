require("../../utils/request.js"), getApp();
Page({
  data: {
    src: ""
  },
  onLoad: function(e) {
    var t = JSON.parse(decodeURIComponent(e.data));
    console.log(t), this.setData({
      src: t.url,
      id: t.id
    })
  }
});