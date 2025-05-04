require("../../@babel/runtime/helpers/Arrayincludes");
var e = function(e, a) {
  if (!a && e && e.__esModule) return e;
  if (null === e || "object" != typeof e && "function" != typeof e) return {
    default: e
  };
  var i = t(a);
  if (i && i.has(e)) return i.get(e);
  var n = {},
    o = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var r in e)
    if ("default" !== r && Object.prototype.hasOwnProperty.call(e, r)) {
      var s = o ? Object.getOwnPropertyDescriptor(e, r) : null;
      s && (s.get || s.set) ? Object.defineProperty(n, r, s) : n[r] = e[r]
    } n.default = e, i && i.set(e, n);
  return n
}(require("../../pkg/unicore_wasm"));

function t(e) {
  if ("function" != typeof WeakMap) return null;
  var a = new WeakMap,
    i = new WeakMap;
  return (t = function(e) {
    return e ? i : a
  })(e)
}
var a = require("../../utils/request.js"),
  i = require("../../utils/qrcode.min.js"),
  n = require("../../utils/util.js"),
  o = require("../../utils/barcodeUse.js"),
  r = getApp();
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
      foreground: "#000000",
      width: 220,
      headerlogo: "",
      bg: ""
    },
    qrcode: "",
    isShowQr: !0,
    hideQrText: "",
    secend: "",
    timer: null,
    timeoutSecend: 1500,
    timeoutResult: null,
    tabbar: [{
      icon: "/style/images/codefd/card.min.png",
      icons: "/style/images/codefd/cards.min.png",
      text: "校园卡",
      checked: !0,
      disabled: !1
    }, {
      icon: "/style/images/codefd/refresh.min.png",
      icons: "/style/images/codefd/refresh.min.png",
      text: "刷新",
      checked: !1,
      disabled: !1
    }, {
      icon: "/style/images/codefd/exit.min.png",
      icons: "/style/images/codefd/exits.min.png",
      text: "退出",
      checked: !1,
      disabled: !1
    }],
    desc: "卡号",
    imgBg: {
      "校友": "https://eweb.hrbeu.edu.cn/cardsurface/22.png",
      "家属": "https://eweb.hrbeu.edu.cn/cardsurface/24.png",
      "培训学员": "https://eweb.hrbeu.edu.cn/cardsurface/25.png",
      "程运启航": "https://eweb.hrbeu.edu.cn/cardsurface/26.png"
    }
  },
  onLoad: function(t) {
    var a, i = this;
    wx.getScreenBrightness({
      success: function(e) {
        i.setData({
          screenBrightness: e.value
        })
      }
    });
    var n = wx.getStorageSync("funcPart") && wx.getStorageSync("funcPart")[0].funcList.concat(wx.getStorageSync("funcPart")[1].funcList) || [],
      o = (null === (a = n[n.findIndex((function(e) {
        return "ecard" == e.id
      }))]) || void 0 === a ? void 0 : a.title) || "电子校园卡";
    wx.setNavigationBarTitle({
      title: o
    }), this.setData({
      origin: t.origin
    }), (0, e.default)("/pkg/unicore_wasm_bg.wasm")
  },
  onReady: function() {
    this.initPage()
  },
  initUniversity: function() {
    var e, t = this,
      a = this.data.config,
      i = wx.getStorageSync("logo") || "",
      n = wx.getStorageSync("headerlogo") || "",
      o = wx.getStorageSync("bg") || "",
      r = (null === (e = wx.getStorageSync("header")) || void 0 === e ? void 0 : e.schoolBadge.split(";")) || ["", "", ""],
      s = [{
        key: "logo",
        value: i
      }, {
        key: "bg",
        value: o
      }, {
        key: "headerlogo",
        value: n
      }];
    a.bg = o, a.headerlogo = n, a.logo = i, this.getPhone(a), this.setData({
      config: a
    }), r.forEach((function(e, i) {
      !s[i].value && e && t.saveImg(s[i].key, e, a)
    })), this.getUserAvatar(), this.initConfigKey()
  },
  getPhone: function(e) {
    try {
      var t = wx.getSystemInfoSync(),
        a = t.windowHeight;
      console.log(t.screenHeight, a), a < 550 ? e.width = 160 : a > 550 && a < 610 && (e.width = 180)
    } catch (e) {}
  },
  initPage: function() {
    this.setData({
      user: wx.getStorageSync("user") || {}
    }), this.getAccountinfo(), this.initUniversity(), this.initClock()
  },
  initQrcode: function() {
    var e = this;
    setTimeout((function() {
      "request" !== e.data.origin ? e.getNetWork() : e.getOfflineKey()
    }), 50)
  },
  getOnlineKey: function() {
    var e = this;
    a.$requestSync("POST", "/miniprogram/onlineUserKeyMeta", {}, (function(t, a) {
      t && "0" == a.retcode && (e.setData({
        type: "在线码"
      }), e.getCode(a.data.encrypted))
    }))
  },
  initConfigKey: function() {
    var t, a, i = this,
      n = (null === (t = wx.getStorageSync("user")) || void 0 === t ? void 0 : t.stuempno) || (null === (a = r.globalData.userInfo) || void 0 === a ? void 0 : a.stuempno);
    if (n)
      if (wx.getStorageSync("privateKey")) {
        try {
          var o, s = null === (o = wx.getStorageSync("offlineConfigs")) || void 0 === o ? void 0 : o.key;
          if (s) return (0, e.create_context)(s, n) || this.toast("初始化失败！"), void this.initQrcode()
        } catch (e) {
          console.log(e)
        }
        wx.getNetworkType({
          success: function(e) {
            var t = e.networkType;
            ["4g", "5g", "wifi"].includes(t) ? i.getKey(!0, n) : i.toast("初始密钥获取失败！")
          }
        })
      } else this.toast("密钥获取失败！");
    else this.toast("学工号获取失败！")
  },
  getOfflineKey: function() {
    var e = wx.getStorageSync("offlineConfigs");
    e && 1 == e.retcode ? this.toast(e.retmsg || "未获取到参数") : (this.setData({
      type: "离线码"
    }), this.getCode(e.encrypted))
  },
  getCode: function(t) {
    try {
      var a = Date.parse(new Date) / 1e3,
        i = (0, e.generate_uniqrcode)(t, wx.getStorageSync("privateKey"), a);
      this.createQrcode(i)
    } catch (e) {
      this.initConfigKey()
    }
  },
  createQrcode: function(e) {
    var t = this;
    clearTimeout(this.data.timeoutResult), clearTimeout(this.data.timeoutQrcode);
    var a = this.data.config,
      n = a.width,
      o = a.canvasId,
      r = a.foreground,
      s = a.logo;
    i({
      width: n,
      height: n,
      canvasId: o,
      text: e,
      foreground: r,
      image: {
        imageResource: s,
        dx: (n - 40) / 2,
        dy: (n - 40) / 2,
        dWidth: 40,
        dHeight: 40
      },
      callback: function(a) {
        clearTimeout(t.data.timeoutQrcode), t.data.timeoutQrcode = setTimeout((function() {
          t.initQrcode()
        }), 6e4), "request" != t.data.origin && (t.setData({
          qrcode: e
        }), t.data.timeoutResult = setTimeout((function() {
          t.useQrcodeResult()
        }), t.data.timeoutSecend))
      }
    })
  },
  getKey: function() {
    var t = this,
      i = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
      o = arguments.length > 1 ? arguments[1] : void 0,
      r = {
        systime: n.formatDateTime(new Date)
      };
    a.$requestSync("POST", "/miniprogram/userKeyConfig", r, (function(a, n) {
      var s = {
        retcode: 1,
        expired: +r.systime.substr(0, 8),
        key: ""
      };
      if (a && "0" == n.retcode && (s.key = n.data.key), t.getOfflineEncoded(s), i) return (0, e.create_context)(s.key, o) || t.toast("初始化失败！"), wx.setStorageSync("offlineConfigs", s), void t.initQrcode();
      t.getOnlineKey()
    }), {
      isShowModal: !1
    })
  },
  getOfflineEncoded: function(e) {
    a.$requestSync("POST", "/miniprogram/offlineUserKeyMeta", {}, (function(t, a) {
      t && "0" == a.retcode ? (e.retcode = 0, e.encrypted = a.data.encrypted) : (e.retcode = !t && a.data ? 1 : 2, e.retmsg = !t && a.data ? a.retmsg : a.status + "：" + a.error), console.log(e), wx.setStorageSync("offlineConfigs", e)
    }), {
      isShowModal: !1
    })
  },
  getNetWork: function() {
    var e = this;
    wx.getNetworkType({
      success: function(t) {
        var a = t.networkType;
        if (["4g", "5g", "wifi"].includes(a)) {
          var i = wx.getStorageSync("offlineConfigs") || {};
          if ("{}" == JSON.stringify(i) || !i.key) return void e.getKey();
          e.getOnlineKey()
        } else e.getOfflineKey()
      }
    })
  },
  initClock: function() {
    var e = this;
    clearInterval(this.data.timeoutClock), this.setData({
      timeoutClock: null
    }), this.data.timeoutClock = setInterval((function() {
      e.setData({
        time: n.formatDateTime(new Date)
      })
    }), 1e3)
  },
  freshQrcode: function() {
    var e = this,
      t = this.data.tabbar;
    this.initQrcode();
    var a = 3;
    t[1].text = a + "s", t[1].disabled = !0, this.setData({
      tabbar: t
    }), this.data.timeoutFresh = setInterval((function() {
      a--, t[1].text = a + "s", e.setData({
        tabbar: t
      }), 0 == a && (clearInterval(e.data.timeoutFresh), t[1].text = "刷新", t[1].disabled = !1, e.setData({
        tabbar: t,
        timeoutFresh: null
      }))
    }), 1e3)
  },
  toast: function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "失败！";
    wx.showModal({
      title: "温馨提示",
      content: e,
      showCancel: !1
    })
  },
  saveImg: function(e, t, a) {
    var i = this;
    wx.getImageInfo({
      src: t,
      success: function(t) {
        a[e] = t.path, wx.setStorageSync(e, t.path), i.setData({
          config: a
        })
      }
    })
  },
  getUserAvatar: function() {
    var e = this,
      t = wx.getStorageSync("avatar");
    if (t) this.setData({
      avatar: t
    });
    else {
      if ("request" == this.data.origin) return;
      a.$requestSync("POST", "/miniprogram/getphoto", {}, (function(t, a) {
        if (0 == a.retcode) {
          var i = a.data.photo;
          wx.setStorageSync("avatar", i), e.setData({
            avatar: i
          })
        }
      }))
    }
  },
  change: function(e) {
    var t = e.currentTarget.dataset.index,
      a = this.data.tabbar;
    a[t].disabled || (1 != t ? (2 == t && wx.navigateBack(), a.forEach((function(e) {
      e.checked = !1
    })), a[t].checked = !0, this.setData({
      tabbar: a
    })) : this.freshQrcode())
  },
  getAccountinfo: function() {
    var e = this;
    a.$requestSync("POST", "/miniprogram/accountinfo", {}, (function(t, a) {
      if (t && 0 == a.retcode) {
        var i = a.data;
        i.balance = (i.balance / 100).toFixed(2), i.expiredateFormat = "2099" == i.expiredate.substr(0, 4) ? "长期" : i.expiredate.substr(0, 4) + "-" + i.expiredate.substr(4, 2) + "-" + i.expiredate.substr(6, 2);
        var n = "卡号";
        n = ["本科生", "硕士研究生", "博士研究生", "专升本"].includes(i.custtypename) ? "学号" : ["教职工", "烟青教职工"].includes(i.custtypename) ? "工号" : n, e.setData({
          user: i,
          desc: n
        }), o.barcode("barcode", i.stuempno, 600, 200)
      }
    }))
  },
  useQrcodeResult: function() {
    var e = this,
      t = {
        qrcode: e.data.qrcode
      };
    a.$payRequestSync("POST", "/miniprogram/queryQrcodeNotify", t, (function(t, a) {
      if (t)
        if (200 === a.statusCode)
          if ("0" == a.data.retcode) {
            var i = a.data.data.data;
            if ("{}" == JSON.stringify(i) || null == i || "" == i) clearInterval(e.data.timer), clearTimeout(e.data.timeoutResult), e.data.timeoutResult = setTimeout((function() {
              e.useQrcodeResult()
            }), e.data.timeoutSecend);
            else if ("wip" == i.notifyStatus) {
              if (e.data.timer) e.setData({
                isShowQr: !1,
                hideQrText: i.notifyContent
              });
              else {
                var n = 10;
                e.data.timer = setInterval((function() {
                  e.setData({
                    secend: n + "s"
                  }), 0 == --n && (clearInterval(e.data.timer), e.setData({
                    isShowQr: !0,
                    timer: null
                  }), e.initQrcode())
                }), 1e3)
              }
              clearTimeout(e.data.timeoutResult), e.data.timeoutResult = setTimeout((function() {
                e.useQrcodeResult()
              }), e.data.timeoutSecend)
            } else {
              clearInterval(e.data.timer);
              var o = {};
              o.notifyContent = i.notifyContent, o.notifyStatus = i.notifyStatus, o.notifyType = i.notifyType, wx.redirectTo({
                url: "/pages/payResult/payResult?from=qrcode&data=" + JSON.stringify(o)
              })
            }
          } else clearInterval(e.data.timer), clearTimeout(e.data.timeoutResult), e.data.timeoutResult = setTimeout((function() {
            e.useQrcodeResult()
          }), e.data.timeoutSecend);
      else clearTimeout(e.data.timeoutResult), clearInterval(e.data.timer), e.data.timeoutResult = setTimeout((function() {
        e.useQrcodeResult()
      }), e.data.timeoutSecend);
      else e.useQrcodeResult()
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