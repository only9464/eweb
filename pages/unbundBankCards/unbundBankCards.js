var a = require("@miniprogram-i18n/core"),
  n = (0, a.getI18nInstance)(),
  t = require("../../utils/request.js");
(0, a.I18nPage)({
  data: {
    detail: {}
  },
  onLoad: function(a) {
    wx.setNavigationBarTitle({
      title: n.t("unbindBankCards")
    });
    var t = JSON.parse(a.str);
    this.setData({
      detail: t
    })
  },
  unbundBankCard: function() {
    var a = this;
    wx.showModal({
      title: "提示",
      content: "确定要解绑当前银行卡吗",
      complete: function(n) {
        if (n.confirm) {
          var e = {
            bankcardno: a.data.detail.bankcardno
          };
          t.$requestSync("POST", "/miniprogram/unbindbankcard", e, (function(a, n) {
            0 == n.retcode && t.$showModal("提示", n.retmsg, "回首页")
          }))
        }
      }
    })
  }
});