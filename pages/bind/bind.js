require("../../@babel/runtime/helpers/Arrayincludes");
var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = require("../../utils/throttle.js"),
  s = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    show: !1,
    stuempno: "",
    custname: "",
    paypwd: "",
    showSsl: !1,
    list: ["初始密码是证件号码后6位，字母用0替换。", "此处的密码为一卡通系统的卡密码,如未修改过卡密码则默认为身份证后七位的前六位", "", "此处使用您APP上的支付密码，若您忘记密码，可在'云大一卡通'APP上重置密码，若未在APP上设置过支付密码，则使用您的卡密码，卡密码默认为身份证后6为，字母用0代替。", "校外用户账号为您注册时使用的手机号,密码为您注册时设置的密码;校园卡用户账号为您的学号/工号/卡号,密码为校园卡密码", "请输入公共数据库密码登录。如无公共数据库账号信息，请输入校园卡密码登录。"],
    rule: "",
    word: "",
    type: "normal",
    isShowPwd: !1,
    idAppidList: ["wx2ffd1318c95146e0"],
    showIdDesc: !1
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("ssltype") || "",
      a = wx.getStorageSync("pwdrule") || 0,
      i = this.data.idAppidList.includes(wx.getAccountInfoSync().miniProgram.appId);
    "ldap" != e && "ecnu" != e || this.setData({
      showSsl: !0
    }), this.setData({
      rule: this.data.list[a],
      word: "3" == a ? s.t("pay") : "phone" == e ? "" : i ? s.t("card") : s.t("school"),
      type: e,
      showIdDesc: i
    }), wx.setNavigationBarTitle({
      title: s.t("login")
    })
  },
  toast: function() {
    var t = wx.getStorageSync("ssl"),
      e = wx.getStorageSync("pwdrule") || 0;
    if (t) wx.showModal({
      title: "温馨提示",
      content: this.data.list[e],
      showCancel: !1
    });
    else {
      ["0", "1", "3"].includes(e) ? wx.showModal({
        title: "温馨提示",
        content: this.data.list[e],
        showCancel: !1
      }) : "2" == e && this.setData({
        show: !0
      })
    }
  },
  close: function(t) {
    this.setData({
      show: t.detail.show
    })
  },
  doBind: a.throttle((function() {
    var t = this.data.paypwd.trim(),
      a = this.data.stuempno.trim(),
      s = this.data.custname.trim();
    if (e.$isEmpty(t) || e.$isEmpty(a)) wx.showModal({
      title: "错误",
      content: "填写信息不能为空",
      showCancel: !1
    });
    else {
      wx.login({
        complete: function(i) {
          var o = i.code,
            n = "";
          wx.getSystemInfo({
            success: function(t) {
              n = t.model
            }
          });
          var c = {
            custname: s,
            stuempno: a,
            code: o,
            paypwd: t,
            model: n
          };
          e.$requestSync("POST", "/wechatauth/bindaccount", c, (function(t, a) {
            if ("0" == a.retcode) {
              var s = a.data.token,
                i = a.data.expiretime;
              wx.setStorageSync("token", s), wx.setStorageSync("expiretime", i), e.$showModal("温馨提示", "恭喜您，登录成功！", "前往首页")
            }
          }), {
            isNeedToken: !1
          })
        }
      })
    }
  }), 3e3),
  setSteno: function(t) {
    this.setData({
      stuempno: t.detail.value
    })
  },
  setName: function(t) {
    this.setData({
      custname: t.detail.value
    })
  },
  setPayPwd: function(t) {
    this.setData({
      paypwd: t.detail.value
    })
  },
  change: function() {
    this.setData({
      isShowPwd: !this.data.isShowPwd
    })
  }
});