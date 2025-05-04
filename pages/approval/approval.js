(0, require("@miniprogram-i18n/core").I18nPage)({
  onLoad: function() {
    var o = this;
    this.onLocaleChange((function(e) {
      console.log("current locale:", o.getLocale(), e)
    })), wx.qy.login({
      success: function(o) {
        console.log(o.code)
      }
    }), this.setLocale("zh-CN")
  },
  toggleLocale: function() {
    this.setLocale("zh-CN" === this.getLocale() ? "en-US" : "zh-CN")
  }
});