var e = require("../../@babel/runtime/helpers/defineProperty"),
  t = require("@miniprogram-i18n/core"),
  a = require("../../utils/qrcode.min.js"),
  i = require("../../utils/request.js"),
  n = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: e(e({
    user: {
      name: "暂无",
      stuempno: ""
    },
    showAuthorPay: "",
    showPayKinds: !1,
    payKinds: "微信支付",
    screenBrightness: "",
    payKindsUrl: "/style/images/pay/wx_logo_app.png",
    list: [{
      id: "qrcode",
      url: "/style/images/paycode/code1.png",
      title: "支付码",
      selUrl: "/style/images/paycode/code.png",
      isSelected: !1,
      isHave: !1
    }, {
      id: "authcode",
      url: "/style/images/paycode/code1.png",
      title: "认证码",
      selUrl: "/style/images/paycode/code.png",
      isSelected: !1,
      isHave: !1
    }, {
      id: "scan",
      url: "/style/images/paycode/scan1.png",
      title: "扫一扫",
      selUrl: "/style/images/paycode/scan1.png",
      isSelected: !1,
      isHave: !1
    }],
    setInter: "",
    id: "",
    logo: "",
    width: 200,
    type: "",
    qrcode: "",
    hideQrText: "",
    isShow: !0,
    time: null,
    secend: ""
  }, "qrcode", ""), "refreshTime", 60),
  onLoad: function(e) {
    this.init(e)
  },
  init: function(e) {
    var t, a, n = this;
    wx.getScreenBrightness({
      success: function(e) {
        n.setData({
          screenBrightness: e.value
        })
      }
    });
    var s = wx.getStorageSync("funcPart");
    if (i.$isEmpty(s)) wx.switchTab({
      url: "/pages/index/index"
    });
    else {
      var o = wx.getStorageSync("ssltype"),
        r = wx.getStorageSync("funcPart")[0].funcList.filter((function(e) {
          return e
        })),
        c = 200;
      "apply" == o ? (r.push({
        id: "qrcode",
        title: "支付码",
        iconSrc: "/style/images/index/payCode.png",
        path: "/pages/payCode/payCode?title=支付码&id=0",
        isHave: !0
      }), c = 256) : "ecnu" == o && (c = 256);
      var d = this.data.list;
      r.forEach((function(e) {
        d.forEach((function(t) {
          e.id == t.id && e.isHave && (t.isHave = !0, t.title = e.title, t.entitle = e.entitle)
        }))
      })), this.setData({
        list: d,
        width: c,
        user: wx.getStorageSync("user") || {},
        type: getApp().globalData.type || wx.getStorageSync("type"),
        title: (null === (t = wx.getStorageSync("header")) || void 0 === t ? void 0 : t.schoolName) || "",
        entitle: (null === (a = wx.getStorageSync("header")) || void 0 === a ? void 0 : a.schoolEnName) || "",
        refreshTime: "sicnu" == wx.getStorageSync("type") ? 10 : 60
      });
      var l = wx.getStorageSync("logoPath"),
        u = l;
      if (setTimeout((function() {
          n.useQrcodeResult()
        }), 1e3), l) this.setData({
        logo: u
      }), this.toUrlc(Number(e.id), this.data.list[e.id].title);
      else {
        var g, h, f = (null === (g = wx.getStorageSync("header")) || void 0 === g || null === (h = g.schoolBadge) || void 0 === h ? void 0 : h.split(";")[0]) || "";
        if (!f) return void this.toUrlc(Number(e.id), this.data.list[e.id].title);
        wx.getImageInfo({
          src: f,
          success: function(e) {
            wx.setStorageSync("logoPath", e.path), n.setData({
              logo: e.path
            })
          },
          complete: function() {
            n.toUrlc(Number(e.id), n.data.list[e.id].title)
          }
        })
      }
    }
  },
  scan: function() {
    var e = this;
    wx.scanCode({
      success: function(t) {
        var a = {
          qrcode: t.result
        };
        i.$requestSync("POST", "/miniprogram/checkqrcode", a, (function(t, a) {
          if (0 == a.retcode) {
            var i = a.data.codetype;
            if ("navigate" == i) {
              var s = {
                url: a.data.url,
                id: e.data.user.stuempno
              };
              wx.navigateTo({
                url: "/pages/scanResult/scanResult?data=" + encodeURIComponent(JSON.stringify(s))
              })
            } else if ("consume" == i) {
              var o = JSON.stringify(a.data.param);
              wx.navigateTo({
                url: "/pages/scanPay/scanPay?data=" + o
              })
            } else "unsupported" == i ? wx.showToast({
              title: n.t("code_err"),
              icon: "none",
              duration: 2e3
            }) : "alert" == i || "c9sw" == i ? setTimeout((function() {
              wx.showToast({
                title: a.data.param.resultInfo,
                icon: "none",
                duration: 2e3
              })
            }), 1e3) : "cgm" == i && wx.navigateTo({
              url: "/pages/venuesCode/venuesCode?q=" + encodeURIComponent(a.data.url)
            })
          }
        }))
      },
      fail: function(e) {
        wx.showToast({
          title: n.t("scan_err"),
          icon: "none",
          duration: 2e3
        })
      }
    })
  },
  toUrl: function(e) {
    this.toUrlc(e.currentTarget.dataset.id, e.currentTarget.dataset.title)
  },
  toUrlc: function(e, t) {
    var a, i, s = this.data.list;
    if ("扫一扫" != t)
      if (s.forEach((function(e) {
          e.isSelected = !1
        })), s[e].isSelected = !0, this.setData({
          list: s,
          showAuthorPay: e + 1,
          id: e
        }), 0 === e ? (a = "/miniprogram/offline", i = "pay_qrcode") : 1 === e && (a = "/miniprogram/onlinecode", i = "auth_qrcode"), this.getCode(a, i), "apply" == this.data.type) wx.setNavigationBarTitle({
        title: n.t("en-US" != this.data.$_locale ? "海大码" : "Qrcode")
      });
      else {
        var o = wx.getStorageSync("funcPart"),
          r = {};
        o.forEach((function(t) {
          t.funcList && t.funcList.forEach((function(t) {
            t.id == s[e].id && (r = t)
          }))
        })), this.setData({
          obj: r
        }), wx.setNavigationBarTitle({
          title: n.t(s[e].id, {
            value: "en-US" != this.data.$_locale ? r.title : r.entitle
          })
        })
      }
    else this.scan()
  },
  getCode: function(e, t) {
    var n = this,
      s = n.data.logo;
    clearInterval(n.data.setInter), i.$requestSync("POST", e, {}, (function(e, i) {
      if ("0" == i.retcode) {
        var o = i.data.qrcode;
        a({
          width: n.data.width,
          height: n.data.width,
          canvasId: t,
          text: o,
          image: {
            imageResource: s,
            dx: (n.data.width - 40) / 2,
            dy: (n.data.width - 40) / 2,
            dWidth: 40,
            dHeight: 40
          },
          callback: function() {
            n.setData({
              qrcode: o
            })
          }
        }), n.startSetInter()
      }
    }))
  },
  changePayCode: function() {
    this.getCode("/miniprogram/offline", "pay_qrcode")
  },
  changeAuthCode: function() {
    this.getCode("/miniprogram/onlinecode", "auth_qrcode")
  },
  startSetInter: function() {
    var e = this,
      t = this;
    t.data.setInter = setInterval((function() {
      var a = t.data.id;
      0 === a ? e.getCode("/miniprogram/offline", "pay_qrcode") : 1 === a && e.getCode("/miniprogram/onlinecode", "auth_qrcode")
    }), 1e3 * t.data.refreshTime)
  },
  onUnload: function() {
    wx.setScreenBrightness({
      value: this.data.screenBrightness
    }), clearInterval(this.data.setInter), clearInterval(this.data.time), this.useQrcodeResult = function() {}
  },
  onHide: function() {
    wx.setScreenBrightness({
      value: this.data.screenBrightness
    })
  },
  onShow: function() {
    wx.setScreenBrightness({
      value: 1
    })
  },
  useQrcodeResult: function() {
    var e = this,
      t = {
        qrcode: e.data.qrcode
      };
    i.$payRequestSync("POST", "/miniprogram/queryQrcodeNotify", t, (function(t, a) {
      if (t)
        if (200 === a.statusCode)
          if ("0" == a.data.retcode) {
            var i = a.data.data.data;
            if ("{}" == JSON.stringify(i) || null == i || "" == i) clearInterval(e.data.time), setTimeout((function() {
              e.useQrcodeResult()
            }), 1e3);
            else if ("wip" == i.notifyStatus) {
              if (e.data.time) e.setData({
                isShow: !1,
                hideQrText: i.notifyContent
              });
              else {
                var n = 10;
                e.data.time = setInterval((function() {
                  e.setData({
                    secend: n + "s"
                  }), 0 == --n && (clearInterval(e.data.time), e.setData({
                    isShow: !0,
                    time: null
                  }), e.toUrlc(e.data.id, e.data.list[e.data.id].title))
                }), 1e3)
              }
              setTimeout((function() {
                e.useQrcodeResult()
              }), 1e3)
            } else {
              clearInterval(e.data.time);
              var s = {
                notifyStatus: i.notifyStatus,
                notifyContent: i.notifyContent
              };
              wx.redirectTo({
                url: "/pages/payResult/payResult?from=qrcode&data=" + JSON.stringify(s)
              })
            }
          } else clearInterval(e.data.time), setTimeout((function() {
            e.useQrcodeResult()
          }), 1e3);
      else clearInterval(e.data.time), setTimeout((function() {
        e.useQrcodeResult()
      }), 1e3);
      else e.useQrcodeResult()
    }))
  }
});