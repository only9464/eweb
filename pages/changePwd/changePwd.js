var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js"),
  a = (0, e.getI18nInstance)();
(0, e.I18nPage)({
  submit: function(e) {
    if (e.detail.value.pwdf === e.detail.value.pwdt) {
      var a = {
        oldpaypwd: e.detail.value.pwdf,
        newpaypwd: e.detail.value.pwdt
      };
      t.$requestSync("POST", "/miniprogram/changepaypwd", a, (function(e, a) {
        0 == a.retcode && (wx.setStorageSync("isResetPwd", !0), t.$showModal("提示", "密码修改成功", "回首页"))
      }))
    } else wx.showToast({
      title: "两次密码输入不一致",
      icon: "none",
      duration: 2e3
    });
    console.log(e.detail.value)
  },
  onLoad: function(e) {
    var t = wx.getStorageSync("funcPart") || [],
      i = {};
    t.forEach((function(e) {
      e.funcList ? e.funcList.forEach((function(e) {
        "changePwd" == e.id && (i = e)
      })) : (i.title = "密码修改", i.entitle = "Change Password")
    })), this.setData({
      obj: i
    }), wx.setNavigationBarTitle({
      title: a.t(i.id, {
        value: "en-US" != this.data.$_locale ? i.title : i.entitle
      })
    })
  }
});