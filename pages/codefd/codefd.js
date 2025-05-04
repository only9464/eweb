var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/qrcode.min.js"),
  a = require("../../utils/request.js"),
  i = require("../../utils/util.js"),
  n = require("../../utils/throttle.js"),
  s = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    user: {
      name: "暂无",
      stuempno: ""
    },
    show: !0,
    list: [{
      id: "qrcodeFD",
      url: "/style/images/paycode/code1.png",
      title: "校园码",
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
    setInter: null,
    id: 0,
    time: i.formatDateTime(new Date),
    clock: null,
    fresh: "刷新",
    down: null,
    logo: "",
    width: 200,
    headerLogo: "/style/images/paycode/logo.png",
    subColor: "ecupl" == wx.getStorageSync("ssltype") ? "#9B3042" : "#3C9DFB",
    type: wx.getStorageSync("ssltype"),
    avatar: wx.getStorageSync("avatar"),
    bg: "",
    secend: "",
    qrcode: "",
    isShow: !0,
    refreshTime: 60
  },
  onLoad: function(t) {
    wx.setNavigationBarTitle({
      title: s.t("qrcodeFD")
    });
    var e = this;
    wx.getScreenBrightness({
      success: function(t) {
        e.setData({
          screenBrightness: t.value
        })
      }
    }), e.init()
  },
  init: function() {
    this.getNavibarColorAndUser(), this.setStyleAndLogo(), this.getUserAvatar()
  },
  setStyleAndLogo: function() {
    var t, e, i = this,
      n = wx.getStorageSync("funcPart");
    if (a.$isEmpty(n)) wx.switchTab({
      url: "/pages/index/index"
    });
    else {
      var s, o, r = wx.getStorageSync("ssltype"),
        c = wx.getStorageSync("funcPart")[0].funcList.filter((function(t) {
          return t
        })),
        l = (null === (t = wx.getStorageSync("header")) || void 0 === t || null === (e = t.schoolBadge) || void 0 === e ? void 0 : e.split(";")) || [],
        u = l[0];
      s = l[2] || "", 256, o = l[1];
      var d = this.data.list;
      c.forEach((function(t) {
        d.forEach((function(e) {
          t.id == e.id && t.isHave && (e.isHave = !0, e.title = t.title, e.entitle = t.entitle)
        }))
      })), this.setData({
        list: d,
        width: 256,
        headerLogo: s,
        bg: o,
        type: r,
        refreshTime: "sicnu" == r ? 10 : 60
      });
      var f = wx.getStorageSync("logoPath"),
        g = "";
      if (setTimeout((function() {
          i.useQrcodeResult()
        }), 1e3), f) g = f, this.setData({
        logo: g
      }), this.toUrlc(0, d[0].title);
      else {
        if (!u) return void this.toUrlc(0, d[0].title);
        var h = this;
        wx.getImageInfo({
          src: u,
          success: function(t) {
            g = t.path, wx.setStorageSync("logoPath", g), h.setData({
              logo: g
            }), h.toUrlc(0, d[0].title)
          },
          fail: function(t) {
            wx.showToast({
              title: "logo加载失败",
              icon: "none"
            }), h.toUrlc(0, d[0].title)
          }
        })
      }
    }
  },
  getNavibarColorAndUser: function() {
    var t = wx.getStorageSync("user"),
      e = wx.getStorageSync("ssltype"),
      a = "#3C9DFB";
    "ecupl" == e ? a = "#9B3042" : "sicnu" == e && (a = "#276E51"), wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: a
    }), this.setData({
      user: t,
      subColor: a
    })
  },
  tofamilyCode: function(t) {
    1 == t.currentTarget.dataset.index ? this.toUrlc(0, "复旦生活码") : (this.setData({
      show: !1
    }), this.toUrlc(1, "change"))
  },
  scan: function() {
    var t = this;
    wx.scanCode({
      success: function(e) {
        var i = e.result,
          n = {
            qrcode: i
          };
        a.$requestSync("POST", "/miniprogram/checkqrcode", n, (function(e, a) {
          if (0 == a.retcode) {
            var n = a.data.codetype;
            if ("navigate" == n) {
              var s = {
                url: i,
                id: t.data.accountinfo.stuempno
              };
              wx.navigateTo({
                url: "/pages/scanResult/scanResult?data=" + encodeURIComponent(JSON.stringify(s))
              })
            } else if ("consume" == n) {
              var o = JSON.stringify(a.data.param);
              wx.navigateTo({
                url: "/pages/scanPay/scanPay?data=" + o
              })
            } else "unsupported" == n ? wx.showToast({
              title: "此二维码暂不支持",
              icon: "none",
              duration: 2e3
            }) : "alert" != n && "c9sw" != n || setTimeout((function() {
              wx.showToast({
                title: a.data.param.resultInfo,
                icon: "none",
                duration: 2e3
              })
            }), 1e3)
          }
        }))
      },
      fail: function(t) {
        wx.showToast({
          title: "识别失败,请重新扫码",
          icon: "none",
          duration: 2e3
        })
      }
    })
  },
  toUrl: n.throttle((function(t) {
    var e = t.currentTarget.dataset,
      a = e.id,
      i = e.title;
    a == this.data.id && "亲属码" != i || this.toUrlc(a, i)
  }), 3e3),
  toUrlc: function(t, e) {
    var a = this.data.list;
    if ("扫一扫" != e)
      if (a.forEach((function(t) {
          t.isSelected = !1
        })), a[t].isSelected = !0, this.setData({
          list: a,
          id: t,
          show: !0
        }), 0 === t) {
        "/miniprogram/offline",
        "pay_qrcode";
        var i = wx.getStorageSync("funcPart"),
          n = {};i.forEach((function(t) {
          t.funcList && t.funcList.forEach((function(t) {
            "qrcodeFD" == t.id && (n = t)
          }))
        })),
        this.setData({
          obj: n
        }),
        wx.setNavigationBarTitle({
          title: s.t("qrcodeFD", {
            value: "en-US" != this.data.$_locale ? n.title : n.entitle
          })
        }),
        this.getCode("/miniprogram/offline", "pay_qrcode")
      }
    else 1 === t && ("change" == e && this.setData({
      show: !1
    }), wx.setNavigationBarTitle({
      title: "亲属码"
    }));
    else this.scan()
  },
  getCode: function(t, i) {
    var n = this,
      s = n.data,
      o = s.logo,
      r = s.width;
    a.$requestSync("POST", t, {}, (function(t, a) {
      if ("0" == a.retcode) {
        var s = a.data.qrcode;
        e({
          width: r,
          height: r,
          canvasId: i,
          text: s,
          image: {
            imageResource: o,
            dx: (r - 40) / 2,
            dy: (r - 40) / 2,
            dWidth: 40,
            dHeight: 40
          },
          callback: function() {
            n.setData({
              qrcode: s
            })
          }
        }), n.startSetInter()
      }
    }))
  },
  changePayCode: function() {
    var t = this,
      e = this.data.id,
      a = 3;
    0 == e && this.getCode("/miniprogram/offline", "pay_qrcode"), this.setData({
      fresh: a + "s"
    }), this.data.down = setInterval((function() {
      a--, t.setData({
        fresh: a + "s"
      }), 0 == a && (clearInterval(t.data.down), t.setData({
        fresh: "刷新",
        down: null
      }))
    }), 1e3)
  },
  startSetInter: function() {
    var t = this,
      e = this;
    clearInterval(e.data.setInter), e.setData({
      setInter: null
    }), e.data.setInter = setInterval((function() {
      var a = e.data.id;
      0 === a && t.getCode("/miniprogram/offline", "pay_qrcode")
    }), 1e3 * e.data.refreshTime)
  },
  onUnload: function() {
    wx.setScreenBrightness({
      value: this.data.screenBrightness
    }), clearInterval(this.data.setInter), clearInterval(this.data.clock), this.setData({
      clock: null,
      setInter: null,
      down: null
    }), this.useQrcodeResult = function() {}
  },
  getUserAvatar: function() {
    var t = this;
    a.$requestSync("POST", "/miniprogram/getphoto", {}, (function(e, a) {
      var i = wx.getStorageSync("avatar") ? wx.getStorageSync("avatar") : "";
      if (0 == a.retcode) {
        var n = a.data.photo;
        n && wx.setStorageSync("avatar", n), t.setData({
          avatar: n || i
        })
      } else t.setData({
        avatar: i
      })
    }))
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
  onReady: function() {
    var t = this;
    clearInterval(t.data.clock), t.setData({
      clock: null
    }), t.data.clock = setInterval((function() {
      var e = i.formatDateTime(new Date);
      t.setData({
        time: e
      })
    }), 1e3)
  },
  useQrcodeResult: function() {
    var t = this,
      e = {
        qrcode: t.data.qrcode
      };
    a.$payRequestSync("POST", "/miniprogram/queryQrcodeNotify", e, (function(e, a) {
      if (e)
        if (200 === a.statusCode)
          if ("0" == a.data.retcode) {
            var i = a.data.data.data;
            if ("{}" == JSON.stringify(i) || null == i || "" == i) clearInterval(t.data.timer), setTimeout((function() {
              t.useQrcodeResult()
            }), 1e3);
            else if ("wip" == i.notifyStatus) {
              if (t.data.timer) t.setData({
                isShow: !1,
                hideQrText: i.notifyContent
              });
              else {
                var n = 10;
                t.data.timer = setInterval((function() {
                  t.setData({
                    secend: n + "s"
                  }), 0 == --n && (clearInterval(t.data.timer), t.setData({
                    isShow: !0,
                    timer: null
                  }), t.toUrlc(0, "复旦生活码"))
                }), 1e3)
              }
              setTimeout((function() {
                t.useQrcodeResult()
              }), 1e3)
            } else {
              clearInterval(t.data.timer);
              var s = {};
              s.notifyContent = i.notifyContent, s.notifyStatus = i.notifyStatus, s.notifyType = i.notifyType, wx.redirectTo({
                url: "/pages/payResult/payResult?from=qrcode&data=" + JSON.stringify(s)
              })
            }
          } else clearInterval(t.data.timer), setTimeout((function() {
            t.useQrcodeResult()
          }), 1e3);
      else clearInterval(t.data.timer), setTimeout((function() {
        t.useQrcodeResult()
      }), 1e3);
      else t.useQrcodeResult()
    }))
  }
});