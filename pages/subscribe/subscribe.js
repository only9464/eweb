require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(e) {
    var s = e.url;
    this.setData({
      src: "https://ecard.sou.edu.cn/epay/wxpage/channel/appset?code=" + s
    }), console.log(s)
  }
});