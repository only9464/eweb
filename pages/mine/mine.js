require("../../@babel/runtime/helpers/Arrayincludes");
var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = getApp(),
  n = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    accountinfo: {},
    setInter: "",
    avatar: "",
    isShowBindCard: !1,
    isShowPwd: !1,
    type: wx.getStorageSync("ssltype"),
    subColor: wx.getStorageSync("subColor")
  },
  toPath: function(t) {
    var e = t.currentTarget.dataset.path;
    wx.navigateTo({
      url: e
    })
  },
  getUserAvatar: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/getphoto", {}, (function(e, a) {
      var n = wx.getStorageSync("avatar") ? wx.getStorageSync("avatar") : "";
      if (0 == a.retcode) {
        var s = a.data.photo;
        s && wx.setStorageSync("avatar", s), t.setData({
          avatar: s || n
        })
      } else t.setData({
        avatar: n
      })
    }))
  },
  loginout: function() {
    var t = this;
    wx.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: function(a) {
        a.confirm && e.$requestSync("POST", "/miniprogram/unbindaccount", {}, (function(e, a) {
          if (0 == a.retcode) {
            var n = wx.getStorageSync("ssl"),
              s = wx.getStorageSync("pwdrule"),
              i = wx.getStorageSync("ssltype"),
              r = ["normal", "", null, void 0, "erGongYe", "ecnu"],
              o = ["wx77c30a197a76fa27"],
              c = wx.getAccountInfoSync().miniProgram.appId;
            wx.showToast({
              title: "退出成功",
              icon: "none",
              duration: 2e3,
              success: function(e) {
                wx.clearStorageSync(), wx.setStorageSync("ssl", n), wx.setStorageSync("pwdrule", s), wx.setStorageSync("ssltype", i), t.data.setInter = setTimeout((function() {
                  wx.reLaunch({
                    url: o.includes(c) ? "/pages/bind/smsBind" : r.includes(i) ? "/pages/bind/bind" : "/pages/chooseIdentity/chooseIdentity"
                  })
                }), 2e3)
              }
            })
          }
        }))
      }
    })
  },
  isNeedBindBnnk: function() {
    var t = this,
      e = wx.getStorageSync("funcPart"),
      a = e[1].funcList ? e[1].funcList : [];
    a.length && a.forEach((function(e) {
      "bindBankCard" == e.id && e.isHave ? t.setData({
        isShowBindCard: !0
      }) : "bindBankCard" == e.id && 0 == e.isHave && t.setData({
        isShowBindCard: !1
      })
    }))
  },
  isNeedChangePwd: function() {
    var t = this,
      e = wx.getStorageSync("funcPart"),
      a = e[1].funcList ? e[1].funcList : [];
    a.length && a.forEach((function(e) {
      "changePwd" == e.id && e.isHave ? t.setData({
        isShowPwd: !0
      }) : "changePwd" == e.id && 0 == e.isHave && t.setData({
        isShowPwd: !1
      })
    }))
  },
  onLoad: function(t) {
    this.getUserAvatar(), this.isNeedBindBnnk(), this.isNeedChangePwd()
  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: n.t("mine")
    }), this.setData({
      accountinfo: a.globalData.userInfo
    });
    var t = a.globalData.userInfo,
      e = t.expiredate,
      s = t.statusname;
    e && (e = e.substr(0, 4) + "." + e.substr(4, 2) + "." + e.substr(6, 2)), this.setData({
      expiredate: e,
      statusname: s
    })
  }
});