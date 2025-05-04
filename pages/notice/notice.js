Page({
  data: {
    src: ""
  },
  onLoad: function(t) {
    var a = t.id;
    "notice" == a ? this.setData({
      src: "https://xxb.fudan.edu.cn/2238/list.htm"
    }) : "noticeCard" == a ? this.setData({
      src: "https://xxb.fudan.edu.cn/65/47/c2452a288071/page.htm"
    }) : this.setData({
      src: "https://xxb.fudan.edu.cn/f7/dd/c2452a260061/page.htm"
    })
  }
});