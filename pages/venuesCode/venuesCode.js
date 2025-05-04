var t = require("../../utils/request.js");
Page({
  data: {
    status: !1,
    text: "登记失败"
  },
  onLoad: function(t) {
    var e = decodeURIComponent(t.q),
      n = this.stringToObj(e);
    console.log(n), this.upload(n ? n.cgm : null)
  },
  stringToObj: function(t) {
    if (-1 == t.indexOf("?")) return null;
    var e = t.split("?")[1].split("&"),
      n = {};
    return e.forEach((function(t) {
      n[t.split("=")[0]] = t.split("=")[1]
    })), n
  },
  upload: function(e) {
    if (null != e && "" != e) {
      var n = {
          cgm: e
        },
        s = this;
      t.$requestSync("POST", "/miniprogram/regVenuesCode", n, (function(t, e) {
        "0" == e.retcode && s.setData({
          status: !0
        }), s.setData({
          text: e.retmsg
        })
      }))
    } else wx.showModal({
      title: "提示",
      content: "场馆码获取失败，请重新扫码再试",
      showCancel: !1
    })
  }
});