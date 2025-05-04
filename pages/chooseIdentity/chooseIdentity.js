var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/sm4"),
  n = require("../../utils/request.js"),
  i = require("../../utils/throttle.js"),
  s = (0, e.getI18nInstance)();
(0, e.I18nPage)({
  data: {
    isAgree: !1,
    show: !1,
    isHavaLay: !1,
    outsideUrl: "/pages/bind/bind",
    insideUrl: "/pages/login/login?code=",
    thirdsideUrl: "/pages/bind/smsBind",
    logo: "",
    desc: "校内用户登录",
    desc2: "校外用户登录",
    desc3: "",
    code: "",
    imgWidth: 350,
    stuempno: "",
    custname: "",
    sendCode: "获取验证码",
    disabled: !1,
    timer: null,
    lay: "复旦大学校园一卡通管理规定",
    rule: "fudan_rule"
  },
  outside: function() {
    var e = this.data.isAgree,
      t = this.data.outsideUrl;
    e ? wx.navigateTo({
      url: t
    }) : wx.showToast({
      icon: "none",
      title: "请先阅读并同意《".concat(this.data.lay, "》")
    })
  },
  inside: function() {
    var e = this.data.isAgree,
      t = this.data.insideUrl;
    e ? wx.login({
      success: function(e) {
        var n = e.code;
        wx.navigateTo({
          url: -1 != t.indexOf("code") ? t + n : t
        })
      }
    }) : wx.showToast({
      icon: "none",
      title: "请先阅读并同意《".concat(this.data.lay, "》")
    })
  },
  thirdside: function() {
    var e = this.data.isAgree,
      t = this.data.thirdsideUrl;
    e ? wx.navigateTo({
      url: t
    }) : wx.showToast({
      icon: "none",
      title: "请先阅读并同意《".concat(this.data.lay, "》")
    })
  },
  change: function(e) {
    this.setData({
      isAgree: !this.data.isAgree
    })
  },
  open_rule: function() {
    this.setData({
      show: !0
    })
  },
  close: function() {
    this.setData({
      show: !1
    })
  },
  getUniversity: function() {
    var e, t, i, o, a = wx.getStorageSync("ssltype") || "",
      d = "/pages/bind/bind",
      r = "校内用户登录";
    "phone" == a && (r = "校外用户认证登录", d = "/pages/bind/smsBind", t = "/style/images/university/hgc.png", i = "/style/images/apply/footer.png", o = 200), e = n.baseUrl.substr(0, n.baseUrl.indexOf("openservice")) + "cardsurface/logo.jpg", this.setData({
      outsideUrl: d,
      insideUrl: "/pages/login/login?code=",
      thirdsideUrl: "/pages/bind/smsBind?type=SchoolMate",
      logo: e,
      isHavaLay: !1,
      isAgree: !0,
      desc: r,
      desc2: "校外用户登录",
      desc3: "校友登录",
      type: a,
      bg: t,
      footer: i,
      lay: "复旦大学校园一卡通管理规定",
      rule: "fudan_rule",
      imgWidth: o
    }), wx.setNavigationBarTitle({
      title: "phone" == a ? "" : s.t("choose_identity")
    })
  },
  onLoad: function(e) {
    this.getUniversity();
    var t = e.errmsg,
      i = e.errcode;
    0 != i && null != i ? setTimeout((function() {
      wx.showModal({
        title: "提示",
        content: t,
        showCancel: !1
      })
    }), 1e3) : null != i && 0 == i && setTimeout((function() {
      n.$showModal("提示", "绑定成功", "去首页")
    }), 1e3)
  },
  getCode: function() {
    var e = this;
    "phone" == (wx.getStorageSync("ssltype") ? wx.getStorageSync("ssltype") : "") && wx.login({
      success: function(t) {
        e.setData({
          code: t.code
        })
      }
    })
  },
  onShow: function() {
    this.getCode()
  },
  toSmsBind: function() {
    wx.navigateTo({
      url: "/pages/bind/outside"
    })
  },
  getPhone: function(e) {
    var t = this,
      i = e.detail,
      s = i.encryptedData,
      o = i.iv,
      a = i.errMsg,
      d = t.data.code; - 1 == a.indexOf("deny") && wx.showModal({
      title: "温馨提示",
      content: "将使用该手机号和昵称作为小程序账号和姓名,是否继续?",
      success: function(e) {
        e.confirm && wx.getUserProfile({
          desc: "获取微信昵称作为小程序用户昵称",
          success: function(e) {
            var i = e.userInfo.nickName;
            console.log(e.userInfo), wx.showLoading({
              title: "请稍等...",
              mask: !0
            });
            var a = {
              code: d,
              encryptedData: s,
              iv: o,
              nickname: i
            };
            console.log(a), n.$requestSync("POST", "/miniprogram/getWxAuthPhoneBind", a, (function(e, n) {
              wx.hideLoading(), "0" == n.retcode ? wx.switchTab({
                url: "/pages/index/index"
              }) : t.getSmsCode()
            }), {
              isNeedToken: !1,
              secend: 4e4
            })
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    })
  },
  bind: i.throttle((function(e) {
    var i = e.detail.value,
      s = i.verifycode,
      o = i.custname,
      a = i.stuempno;
    "" != s ? wx.login({
      complete: function(e) {
        var i = e.code,
          d = wx.getSystemInfoSync().model,
          r = {
            custname: o.indexOf("一") > -1 ? o.trim() : (0, t.encrypted)(o.trim()),
            stuempno: (0, t.encrypted)(a.trim()),
            code: i.trim(),
            model: d.trim(),
            paypwd: (0, t.encrypted)("".trim()),
            verifycode: s.trim(),
            businessType: "MiniprogramLogin".trim()
          };
        n.$requestSync("POST", "/wechatauth/bindaccount", r, (function(e, t) {
          if ("0" == t.retcode) {
            var i = t.data.token,
              s = t.data.expiretime;
            wx.setStorageSync("token", i), wx.setStorageSync("expiretime", s), n.$showModal("提示", "登录成功", "前往首页")
          }
        }), {
          isNeedToken: !1
        })
      }
    }) : wx.showModal({
      title: "提示",
      content: "请输入验证码",
      showCancel: !1
    })
  }), 3e3),
  getSmsCode: function() {
    var e = this,
      t = e.data,
      i = (t.sendCode, t.custname),
      s = t.stuempno;
    if ("" != i && "" != s) {
      var o = {
          phone: "",
          type: "MiniprogramLogin",
          stuempno: s.trim(),
          custname: i.trim()
        },
        a = 60;
      e.setData({
        sendCode: a + "s",
        disabled: !0
      }), n.$requestSync("POST", "/miniprogram/sms/sendVerifyCode", o, (function(t, n) {
        0 == n.retcode ? (wx.showToast({
          title: "短信已发送，请注意查收！",
          icon: "none",
          duration: 3e3
        }), e.data.timer = setInterval((function() {
          0 != a ? (a--, e.setData({
            sendCode: a + "s"
          })) : (e.setData({
            sendCode: "重新获取",
            disabled: !1
          }), clearInterval(e.data.timer))
        }), 1e3)) : e.setData({
          sendCode: "重新获取",
          disabled: !1
        })
      }), {
        isNeedToken: !1
      })
    } else wx.showModal({
      title: "提示",
      content: "姓名或学号不能为空",
      showCancel: !1
    })
  },
  onUnload: function() {
    this.timer = null, this.setData({
      timer: null
    })
  },
  getCustname: function(e) {
    this.setData({
      custname: e.detail.value
    })
  },
  getStuempno: function(e) {
    this.setData({
      stuempno: e.detail.value
    })
  }
});