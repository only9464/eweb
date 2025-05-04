var e = (0, require("@miniprogram-i18n/core").getI18nInstance)(),
  t = (wx.getUpdateManager(), require("utils/request.js")),
  n = require("utils/util");
App({
  globalData: {
    appid: "wxc9b4543d433142ee",
    userInfo: {},
    language: "",
    type: "",
    color: "#3C9DFB"
  },
  onShow: function() {
    var t = this;
    e.onLocaleChange((function(t) {
      console.log("current locale:", e.getLocale(), t)
    })), wx.getSystemInfo({
      success: function(n) {
        var o = n.language;
        t.globalData.language = o, console.log(o), "zh_CN" == o ? e.setLocale("zh-CN") : e.setLocale("en-US")
      },
      fail: function() {
        e.setLocale("zh-CN")
      }
    })
  },
  onLaunch: function(e) {
    this.autoUpdate(), this.getNetWork(), wx.setStorageSync("isResetPwd", wx.getStorageSync("isResetPwd"))
  },
  getNetWork: function() {
    var e = this;
    wx.getNetworkType({
      success: function(t) {
        "none" == t.networkType ? wx.reLaunch({
          url: "/pages/neterr/neterr"
        }) : e.isExpired()
      }
    })
  },
  isExpired: function() {
    var e = wx.getStorageSync("offlineConfigs") || {},
      t = e.expired,
      o = n.formatDateTime(new Date).substr(0, 8);
    ("{}" == JSON.stringify(e) || +o > t || 0 != e.retcode) && this.getOfflineConfigs()
  },
  getOfflineEncoded: function(e) {
    t.$requestSync("POST", "/miniprogram/offlineUserKeyMeta", {}, (function(t, n) {
      t && "0" == n.retcode ? (e.retcode = 0, e.encrypted = n.data.encrypted) : (e.retcode = !t && n.data ? 1 : 2, e.retmsg = !t && n.data ? n.retmsg : n.status + "：" + n.error), console.log(e), wx.setStorageSync("offlineConfigs", e)
    }), {
      isShowModal: !1
    })
  },
  getOfflineConfigs: function() {
    var e = this,
      o = {
        systime: n.formatDateTime(new Date)
      };
    t.$requestSync("POST", "/miniprogram/userKeyConfig", o, (function(t, o) {
      var a = {
        retcode: 1,
        expired: n.formatDateTime(new Date((new Date).getTime() + 12096e5)).substr(0, 8),
        key: ""
      };
      t && "0" == o.retcode && (a.key = o.data.key), e.getOfflineEncoded(a)
    }), {
      isShowModal: !1
    })
  },
  autoUpdate: function() {
    var e = this;
    if (wx.canIUse("getUpdateManager")) {
      var t = wx.getUpdateManager();
      t.onCheckForUpdate((function(n) {
        n.hasUpdate && (t.onUpdateReady((function() {
          wx.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            success: function(n) {
              n.confirm ? (wx.clearStorageSync(), t.applyUpdate()) : n.cancel && wx.showModal({
                title: "温馨提示~",
                content: "本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~",
                success: function(t) {
                  e.autoUpdate()
                }
              })
            }
          })
        })), t.onUpdateFailed((function() {
          wx.showModal({
            title: "已经有新版本~",
            content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开~"
          })
        })))
      }))
    } else wx.showModal({
      title: "提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    })
  }
});