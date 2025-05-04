var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = require("../../utils/util.js"),
  i = require("../../utils/qrcode.min.js");
require("../../utils/throttle.js"), (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    timeoutQrcode: null,
    timeoutClock: null,
    timeoutFresh: null,
    time: a.formatDateTime(new Date),
    fresh: "刷新",
    user: {},
    screenBrightness: "",
    type: "",
    origin: "",
    avatar: "",
    config: {
      canvasId: "canvasId",
      logo: "",
      foreground: "#000",
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
  onLoad: function(t) {
    var e, a = this;
    wx.getScreenBrightness({
      success: function(t) {
        a.setData({
          screenBrightness: t.value
        })
      }
    });
    var i = wx.getStorageSync("funcPart") && wx.getStorageSync("funcPart")[0].funcList.concat(wx.getStorageSync("funcPart")[1].funcList) || [],
      o = (null === (e = i[i.findIndex((function(t) {
        return "oneCodePass" == t.id
      }))]) || void 0 === e ? void 0 : e.title) || "一码通";
    wx.setNavigationBarTitle({
      title: o
    })
  },
  onReady: function() {
    this.initPage()
  },
  initPage: function() {
    this.setData({
      user: wx.getStorageSync("user") || {}
    }), this.initUniversity(), this.initClock()
  },
  initUniversity: function() {
    var t, e = this,
      a = this.data.config,
      i = wx.getStorageSync("logo") || "",
      o = wx.getStorageSync("headerlogo") || "",
      n = (wx.getStorageSync("bg"), (null === (t = wx.getStorageSync("header")) || void 0 === t ? void 0 : t.schoolBadge.split(";")) || ["", "", ""]),
      r = [{
        key: "logo",
        value: i
      }, {
        key: "bg",
        value: n[1]
      }, {
        key: "headerlogo",
        value: o
      }];
    a.bg = n[1], a.headerlogo = o, a.logo = i, this.setData({
      config: a
    }), n.forEach((function(t, i) {
      !r[i].value && t && e.saveImg(r[i].key, t, a)
    })), this.getUserAvatar(), this.getOfflineCode()
  },
  saveImg: function(t, e, a) {
    var i = this;
    wx.getImageInfo({
      src: e,
      success: function(e) {
        a[t] = e.path, wx.setStorageSync(t, e.path), i.setData({
          config: a
        })
      }
    })
  },
  getOfflineCode: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/offline", {}, (function(e, a) {
      if ("0" == a.retcode) {
        var i = a.data.qrcode;
        t.createCode(i)
      }
    }))
  },
  createCode: function(t) {
    var e = this;
    clearTimeout(this.data.timeoutQrcode), clearTimeout(this.data.timeoutResult);
    var a = this.data.config,
      o = a.width,
      n = a.canvasId,
      r = a.foreground,
      s = a.logo;
    i({
      width: o,
      height: o,
      canvasId: n,
      text: t,
      foreground: r,
      image: {
        imageResource: s,
        dx: (o - 40) / 2,
        dy: (o - 40) / 2,
        dWidth: 40,
        dHeight: 40
      },
      callback: function(a) {
        e.data.timeoutQrcode = setTimeout((function() {
          e.getOfflineCode()
        }), 6e4), e.setData({
          qrcode: t
        }), e.data.timeoutResult = setTimeout((function() {
          e.useQrcodeResult()
        }), e.data.timeoutSecend)
      }
    })
  },
  freshQrcode: function() {
    var t = this;
    this.getOfflineCode();
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
  initClock: function() {
    var t = this;
    clearInterval(this.data.timeoutClock), this.setData({
      timeoutClock: null
    }), this.data.timeoutClock = setInterval((function() {
      t.setData({
        time: a.formatDateTime(new Date)
      })
    }), 1e3)
  },
  getUserAvatar: function() {
    var t = this,
      a = wx.getStorageSync("avatar");
    if (a) this.setData({
      avatar: a
    });
    else {
      if ("request" == this.data.origin) return;
      e.$requestSync("POST", "/miniprogram/getphoto", {}, (function(e, a) {
        if (0 == a.retcode) {
          var i = a.data.photo;
          wx.setStorageSync("avatar", i), t.setData({
            avatar: i
          })
        }
      }))
    }
  },
  toPay: function() {
    wx.navigateTo({
      url: "/pages/pay/pay"
    })
  },
  useQrcodeResult: function() {
    var t = this,
      a = this,
      i = {
        qrcode: a.data.qrcode
      };
    e.$payRequestSync("POST", "/miniprogram/queryQrcodeNotify", i, (function(e, i) {
      if (e)
        if (200 === i.statusCode)
          if ("0" == i.data.retcode) {
            var o = i.data.data.data;
            if ("{}" == JSON.stringify(o) || null == o || "" == o) clearInterval(a.data.timer), clearTimeout(t.data.timeoutResult), t.data.timeoutResult = setTimeout((function() {
              a.useQrcodeResult()
            }), a.data.timeoutSecend);
            else if ("wip" == o.notifyStatus) {
              if (a.data.timer) a.setData({
                isShowQr: !1,
                hideQrText: o.notifyContent
              });
              else {
                var n = 10;
                a.data.timer = setInterval((function() {
                  a.setData({
                    secend: n + "s"
                  }), 0 == --n && (clearInterval(a.data.timer), a.setData({
                    isShowQr: !0,
                    timer: null
                  }), a.initQrcode())
                }), 1e3)
              }
              clearTimeout(t.data.timeoutResult), t.data.timeoutResult = setTimeout((function() {
                a.useQrcodeResult()
              }), a.data.timeoutSecend)
            } else {
              clearInterval(a.data.timer);
              var r = {};
              r.notifyContent = o.notifyContent, r.notifyStatus = o.notifyStatus, r.notifyType = o.notifyType, wx.redirectTo({
                url: "/pages/payResult/payResult?from=qrcode&data=" + JSON.stringify(r)
              })
            }
          } else clearInterval(a.data.timer), clearTimeout(t.data.timeoutResult), t.data.timeoutResult = setTimeout((function() {
            a.useQrcodeResult()
          }), a.data.timeoutSecend);
      else clearInterval(a.data.timer), clearTimeout(t.data.timeoutResult), t.data.timeoutResult = setTimeout((function() {
        a.useQrcodeResult()
      }), a.data.timeoutSecend);
      else a.useQrcodeResult()
    }))
  },
  onUnload: function() {
    wx.setScreenBrightness({
      value: this.data.screenBrightness
    }), clearTimeout(this.data.timeoutQrcode), clearTimeout(this.data.timeoutResult), clearTimeout(this.data.timeoutClock), clearTimeout(this.data.timeoutFresh), clearInterval(this.data.timer), this.setData({
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