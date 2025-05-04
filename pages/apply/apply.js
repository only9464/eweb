var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js"),
  n = require("../../utils/throttle.js"),
  a = (0, e.getI18nInstance)();
(0, e.I18nPage)({
  data: {
    sendCode: "获取验证码",
    timer: null,
    disabled: !1,
    phone: "",
    type: ""
  },
  onLoad: function(e) {
    var t = wx.getStorageSync("funcPart"),
      n = {};
    t.length ? (t.forEach((function(e) {
      e.funcList && e.funcList.forEach((function(e) {
        "apply" == e.id && (n = e)
      }))
    })), wx.setNavigationBarTitle({
      title: a.t(n.id, {
        value: "en-US" != this.data.$_locale ? n.title : n.entitle
      })
    })) : wx.setNavigationBarTitle({
      title: a.t("apply", {
        value: "en-US" != this.data.$_locale ? "注册申请" : "Register"
      })
    }), this.setData({
      from: e.from,
      type: getApp().globalData.type || wx.getStorageSync("ssltype")
    })
  },
  toBind: function() {
    wx.navigateTo({
      url: "apply" == this.data.type ? "/pages/bind/smsBind" : "/pages/bind/bind"
    })
  },
  apply: n.throttle((function(e) {
    var n = this,
      a = e.detail.value,
      i = a.name,
      o = a.idno,
      s = a.phone,
      d = a.sex,
      r = a.code;
    if (i && o && s && d && r) {
      if (/^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(o) || /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/.test(o)) {
        var l = {
          name: i,
          idno: o,
          sex: d,
          phone: s,
          code: r,
          type: "ApplyVirtualCard"
        };
        t.$requestSync("POST", "/miniprogram/common/applyVirtualCard", l, (function(e, t) {
          0 == t.retcode && (t.data.needCheck ? wx.showModal({
            title: "提示",
            content: "申请成功,审核成功后即可登录小程序(登陆密码为身份证后6位,为防止他人盗用请及时更改密码)",
            showCancel: !1,
            success: function(e) {
              e.confirm && wx.switchTab({
                url: "/pages/index/index"
              })
            }
          }) : wx.showModal({
            title: "提示",
            content: "申请成功，登陆密码为身份证后6位。为防止他人盗用请及时更改密码！",
            showCancel: !1,
            confirmText: "bind" == n.data.from ? "立即登录" : "返回首页",
            success: function(e) {
              e.confirm && "bind" == n.data.from ? "apply" == n.data.type ? n.bind(i, s, o.substr(o.length - 6, 6)) : wx.navigateTo({
                url: "/pages/bind/bind"
              }) : wx.switchTab({
                url: "/pages/index/index"
              })
            }
          }))
        }), {
          isNeedToken: !1
        })
      } else wx.showToast({
        title: "请输入正确的身份证号！",
        icon: "none"
      })
    } else wx.showToast({
      title: "请完整填写您的信息！",
      icon: "none"
    })
  }), 1500),
  sendCode: function() {
    var e = this,
      n = e.data,
      a = (n.sendCode, n.phone);
    if (/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(a)) {
      var i = 60;
      e.setData({
        sendCode: i + "s",
        disabled: !0
      });
      var o = {
        phone: a,
        type: "ApplyVirtualCard"
      };
      t.$requestSync("POST", "/miniprogram/sms/sendVerifyCode", o, (function(t, n) {
        0 == n.retcode ? (wx.showToast({
          title: n.data.retmsg,
          icon: "none"
        }), e.timer = setInterval((function() {
          0 != i ? (i--, e.setData({
            sendCode: i + "s"
          })) : (e.setData({
            sendCode: "重新获取",
            disabled: !1
          }), clearInterval(e.timer))
        }), 1e3)) : e.setData({
          sendCode: "重新获取",
          disabled: !1
        })
      }), {
        isNeedToken: !1
      })
    } else wx.showToast({
      title: "请输入正确的手机号",
      icon: "none"
    })
  },
  bind: function(e, n, a) {
    wx.login({
      complete: function(i) {
        var o = i.code,
          s = "";
        wx.getSystemInfo({
          success: function(e) {
            s = e.model
          }
        });
        var d = {
          custname: e,
          stuempno: n,
          code: o,
          paypwd: a,
          model: s
        };
        t.$requestSync("POST", "/wechatauth/bindaccount", d, (function(e, t) {
          if ("0" == t.retcode) {
            var n = t.data.token,
              a = t.data.expiretime;
            wx.setStorageSync("token", n), wx.setStorageSync("expiretime", a), wx.switchTab({
              url: "/pages/index/index"
            })
          }
        }), {
          isNeedToken: !1
        })
      }
    })
  },
  getPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  onUnload: function() {
    this.timer = null, this.setData({
      timer: null
    })
  }
});