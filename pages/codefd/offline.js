require("../../@babel/runtime/helpers/Arrayincludes");
var t = function(t, i) {
  if (!i && t && t.__esModule) return t;
  if (null === t || "object" != typeof t && "function" != typeof t) return {
    default: t
  };
  var a = e(i);
  if (a && a.has(t)) return a.get(t);
  var n = {},
    o = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var r in t)
    if ("default" !== r && Object.prototype.hasOwnProperty.call(t, r)) {
      var s = o ? Object.getOwnPropertyDescriptor(t, r) : null;
      s && (s.get || s.set) ? Object.defineProperty(n, r, s) : n[r] = t[r]
    } n.default = t, a && a.set(t, n);
  return n
}(require("../../pkg/unicore_wasm"));

function e(t) {
  if ("function" != typeof WeakMap) return null;
  var i = new WeakMap,
    a = new WeakMap;
  return (e = function(t) {
    return t ? a : i
  })(t)
}
var i = require("../../utils/request.js"),
  a = require("../../utils/qrcode.min.js"),
  n = require("../../utils/util.js"),
  o = getApp();
Page({
  data: {
    timeoutQrcode: null,
    timeoutClock: null,
    timeoutFresh: null,
    time: n.formatDateTime(new Date),
    fresh: "刷新",
    user: {},
    screenBrightness: "",
    type: "",
    origin: "",
    avatar: "",
    config: {
      canvasId: "canvasId",
      logo: "",
      foreground: "#00518E",
      width: 230,
      headerlogo: "",
      bg: ""
    },
    qrcode: "",
    isShowQr: !0,
    hideQrText: "",
    secend: "",
    timer: null,
    timeoutSecend: 1500,
    timeoutResult: null
  },
  onLoad: function(e) {
    var i, a = this;
    wx.getScreenBrightness({
      success: function(t) {
        a.setData({
          screenBrightness: t.value
        })
      }
    });
    var n = wx.getStorageSync("funcPart") && wx.getStorageSync("funcPart")[0].funcList.concat(wx.getStorageSync("funcPart")[1].funcList) || [],
      o = (null === (i = n[n.findIndex((function(t) {
        return "offline" == t.id
      }))]) || void 0 === i ? void 0 : i.title) || "离线码";
    wx.setNavigationBarTitle({
      title: o
    }), this.setData({
      origin: e.origin
    }), (0, t.default)("/pkg/unicore_wasm_bg.wasm").then((function() {
      a.initPage()
    }))
  },
  onReady: function() {},
  initUniversity: function() {
    var t, e = this,
      i = this.data.config,
      a = wx.getStorageSync("logo") || "",
      n = wx.getStorageSync("headerlogo") || "",
      o = wx.getStorageSync("bg") || "",
      r = (null === (t = wx.getStorageSync("header")) || void 0 === t ? void 0 : t.schoolBadge.split(";")) || ["", "", ""],
      s = [{
        key: "logo",
        value: a
      }, {
        key: "bg",
        value: o
      }, {
        key: "headerlogo",
        value: n
      }];
    i.bg = o, i.headerlogo = n, i.logo = a, this.setData({
      config: i
    }), r.forEach((function(t, a) {
      !s[a].value && t && e.saveImg(s[a].key, t, i)
    })), this.getUserAvatar(), this.initConfigKey()
  },
  initPage: function() {
    this.setData({
      user: wx.getStorageSync("user") || {}
    }), this.initUniversity(), this.initClock()
  },
  initQrcode: function() {
    var t = this;
    setTimeout((function() {
      "request" !== t.data.origin ? t.getNetWork() : t.getOfflineKey()
    }), 50)
  },
  getOnlineKey: function() {
    var t = this;
    i.$requestSync("POST", "/miniprogram/onlineUserKeyMeta", {}, (function(e, i) {
      e && "0" == i.retcode && (t.setData({
        type: "在线码"
      }), t.getCode(i.data.encrypted))
    }))
  },
  initConfigKey: function() {
    var e, i, a = this,
      n = (null === (e = wx.getStorageSync("user")) || void 0 === e ? void 0 : e.stuempno) || (null === (i = o.globalData.userInfo) || void 0 === i ? void 0 : i.stuempno);
    if (n)
      if (wx.getStorageSync("privateKey")) {
        try {
          var r, s = null === (r = wx.getStorageSync("offlineConfigs")) || void 0 === r ? void 0 : r.key;
          if (s) return (0, t.create_context)(s, n) || this.toast("初始化失败！"), void this.initQrcode()
        } catch (t) {
          this.toast((t + "").substr(0, 30))
        }
        wx.getNetworkType({
          success: function(t) {
            var e = t.networkType;
            ["4g", "5g", "wifi"].includes(e) ? a.getKey(!0, n) : a.toast("初始密钥获取失败！")
          }
        })
      } else this.toast("密钥获取失败！");
    else this.toast("学工号获取失败！")
  },
  getOfflineKey: function() {
    var t = wx.getStorageSync("offlineConfigs");
    t && 1 == t.retcode ? this.toast(t.retmsg || "未获取到参数") : (this.setData({
      type: "离线码"
    }), this.getCode(t.encrypted))
  },
  getCode: function(e) {
    try {
      var i = Date.parse(new Date) / 1e3,
        a = (0, t.generate_uniqrcode)(e, wx.getStorageSync("privateKey"), i);
      this.createQrcode(a)
    } catch (t) {
      this.initConfigKey()
    }
  },
  createQrcode: function(t) {
    var e = this;
    clearTimeout(this.data.timeoutResult), clearTimeout(this.data.timeoutQrcode);
    var i = this.data.config,
      n = i.width,
      o = i.canvasId,
      r = i.foreground,
      s = i.logo;
    a({
      width: n,
      height: n,
      canvasId: o,
      text: t,
      foreground: r,
      image: {
        imageResource: s,
        dx: (n - 40) / 2,
        dy: (n - 40) / 2,
        dWidth: 40,
        dHeight: 40
      },
      callback: function(i) {
        e.data.timeoutQrcode = setTimeout((function() {
          e.initQrcode()
        }), 6e4), "request" != e.data.origin && (e.setData({
          qrcode: t
        }), e.data.timeoutResult = setTimeout((function() {
          e.useQrcodeResult()
        }), e.data.timeoutSecend))
      }
    })
  },
  getKey: function() {
    var e = this,
      a = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
      o = arguments.length > 1 ? arguments[1] : void 0,
      r = {
        systime: n.formatDateTime(new Date)
      };
    i.$requestSync("POST", "/miniprogram/userKeyConfig", r, (function(i, n) {
      var s = {
        retcode: 1,
        expired: +r.systime.substr(0, 8),
        key: ""
      };
      if (i && "0" == n.retcode && (s.key = n.data.key), e.getOfflineEncoded(s), a) return (0, t.create_context)(s.key, o) || e.toast("初始化失败！"), wx.setStorageSync("offlineConfigs", s), void e.initQrcode();
      e.getOnlineKey()
    }), {
      isShowModal: !1
    })
  },
  getOfflineEncoded: function(t) {
    i.$requestSync("POST", "/miniprogram/offlineUserKeyMeta", {}, (function(e, i) {
      e && "0" == i.retcode ? (t.retcode = 0, t.encrypted = i.data.encrypted) : (t.retcode = !e && i.data ? 1 : 2, t.retmsg = !e && i.data ? i.retmsg : i.status + "：" + i.error), console.log(t), wx.setStorageSync("offlineConfigs", t)
    }), {
      isShowModal: !1
    })
  },
  getNetWork: function() {
    var t = this;
    wx.getNetworkType({
      success: function(e) {
        var i = e.networkType;
        if (["4g", "5g", "wifi"].includes(i)) {
          var a = wx.getStorageSync("offlineConfigs") || {};
          if ("{}" == JSON.stringify(a) || !a.key) return void t.getKey();
          t.getOnlineKey()
        } else t.getOfflineKey()
      }
    })
  },
  initClock: function() {
    var t = this;
    clearInterval(this.data.timeoutClock), this.setData({
      timeoutClock: null
    }), this.data.timeoutClock = setInterval((function() {
      t.setData({
        time: n.formatDateTime(new Date)
      })
    }), 1e3)
  },
  freshQrcode: function() {
    var t = this;
    this.initQrcode();
    var e = 3;
    this.setData({
      fresh: e + "s"
    }), this.data.timeoutFresh = setInterval((function() {
      e--, t.setData({
        fresh: e + "s"
      }), 0 == e && (clearInterval(t.data.timeoutFresh), t.setData({
        fresh: "刷新",
        timeoutFresh: null
      }))
    }), 1e3)
  },
  toast: function() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "失败！";
    wx.showModal({
      title: "温馨提示",
      content: t,
      showCancel: !1
    })
  },
  saveImg: function(t, e, i) {
    var a = this;
    wx.getImageInfo({
      src: e,
      success: function(e) {
        i[t] = e.path, wx.setStorageSync(t, e.path), a.setData({
          config: i
        })
      }
    })
  },
  getUserAvatar: function() {
    var t = this,
      e = wx.getStorageSync("avatar");
    if (e) this.setData({
      avatar: e
    });
    else {
      if ("request" == this.data.origin) return;
      i.$requestSync("POST", "/miniprogram/getphoto", {}, (function(e, i) {
        if (0 == i.retcode) {
          var a = i.data.photo;
          wx.setStorageSync("avatar", a), t.setData({
            avatar: a
          })
        }
      }))
    }
  },
  useQrcodeResult: function() {
    var t = this,
      e = {
        qrcode: t.data.qrcode
      };
    i.$payRequestSync("POST", "/miniprogram/queryQrcodeNotify", e, (function(e, i) {
      if (e)
        if (200 === i.statusCode)
          if ("0" == i.data.retcode) {
            var a = i.data.data.data;
            if ("{}" == JSON.stringify(a) || null == a || "" == a) clearInterval(t.data.timer), clearTimeout(t.data.timeoutResult), t.data.timeoutResult = setTimeout((function() {
              t.useQrcodeResult()
            }), t.data.timeoutSecend);
            else if ("wip" == a.notifyStatus) {
              if (t.data.timer) t.setData({
                isShowQr: !1,
                hideQrText: a.notifyContent
              });
              else {
                var n = 10;
                t.data.timer = setInterval((function() {
                  t.setData({
                    secend: n + "s"
                  }), 0 == --n && (clearInterval(t.data.timer), t.setData({
                    isShowQr: !0,
                    timer: null
                  }), t.initQrcode())
                }), 1e3)
              }
              clearTimeout(t.data.timeoutResult), t.data.timeoutResult = setTimeout((function() {
                t.useQrcodeResult()
              }), t.data.timeoutSecend)
            } else {
              clearInterval(t.data.timer);
              var o = {};
              o.notifyContent = a.notifyContent, o.notifyStatus = a.notifyStatus, o.notifyType = a.notifyType, wx.redirectTo({
                url: "/pages/payResult/payResult?from=qrcode&data=" + JSON.stringify(o)
              })
            }
          } else clearInterval(t.data.timer), clearTimeout(t.data.timeoutResult), t.data.timeoutResult = setTimeout((function() {
            t.useQrcodeResult()
          }), t.data.timeoutSecend);
      else clearInterval(t.data.timer), clearTimeout(t.data.timeoutResult), t.data.timeoutResult = setTimeout((function() {
        t.useQrcodeResult()
      }), t.data.timeoutSecend);
      else t.useQrcodeResult()
    }))
  },
  onUnload: function() {
    wx.setScreenBrightness({
      value: this.data.screenBrightness
    }), clearTimeout(this.data.timeoutQrcode), clearTimeout(this.data.timeoutClock), clearTimeout(this.data.timeoutResult), clearTimeout(this.data.timeoutFresh), clearInterval(this.data.timer), this.setData({
      timeoutClock: null,
      timeoutQrcode: null,
      timeoutResult: null,
      timeoutFresh: null,
      timer: null
    }), this.useQrcodeResult = function() {}
  },
  onShow: function() {
    wx.setScreenBrightness({
      value: .7
    })
  },
  onHide: function() {
    wx.setScreenBrightness({
      value: this.data.screenBrightness
    })
  }
});