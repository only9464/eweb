var s = require("../../utils/request.js");
Page({
  data: {
    src: ""
  },
  onLoad: function(t) {
    this.setData({
      src: s.baseUrl.substr(0, s.baseUrl.lastIndexOf("/")) + "/atth5/?stuempNo=" + (null == t ? void 0 : t.url)
    })
  }
});