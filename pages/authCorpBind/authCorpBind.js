var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js");
(0, e.I18nPage)({
  data: {
    src: ""
  },
  onLoad: function() {
    var e = this;
    t.$requestSync("POST", "/miniprogram/getCorpid", {}, (function(o, c) {
      if ("0" == c.retcode) {
        var r = c.data;
        wx.login({
          success: function(o) {
            var c = o.code;
            e.setData({
              src: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=".concat(r, "&redirect_uri=").concat(encodeURIComponent(t.baseUrl + "/Oauth2/login"), "&response_type=code&scope=snsapi_base&state=").concat(c, "#wechat_redirect")
            }), console.log(e.data.src)
          }
        })
      }
    }), {
      isNeedToken: !1
    })
  }
});