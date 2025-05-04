var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js"),
  a = require("../../utils/throttle.js");
(0, e.getI18nInstance)();
(0, e.I18nPage)({
  data: {
    stuempno: "",
    custname: "",
    sendCode: "获取验证码",
    disabled: !1,
    timer: null,
    type: "",
    businessType: "",
    paypwd: "",
    appid: "",
    staticVerifyText: "",
    verifytext: ""
  },
  onLoad: function(e) {
    var t = e.type || "MiniprogramLogin";
    wx.setNavigationBarTitle({
      title: "SchoolMate" == t ? "校友登录" : "登录"
    }), this.setData({
      type: getApp().globalData.type || wx.getStorageSync("ssltype"),
      businessType: t,
      appid: wx.getAccountInfoSync().miniProgram.appId
    })
  },
  bind: a.throttle((function(e) {
    var a = this,
      n = e.detail.value,
      i = n.verifycode,
      s = n.custname,
      o = n.stuempno;
    "" != i ? wx.login({
      complete: function(e) {
        var n = e.code,
          r = wx.getSystemInfoSync().model,
          d = a.data.businessType,
          c = a.data.appid,
          u = a.data.paypwd,
          l = {
            custname: "apply" == wx.getStorageSync("ssltype") ? "" : s.trim(),
            stuempno: o.trim(),
            code: n.trim(),
            model: r.trim(),
            paypwd: u.trim(),
            verifycode: i.trim(),
            businessType: d.trim()
          };
        "SchoolMate" == d && (l.phone = o.trim(), l.custname = s.trim()), t.$requestSync("POST", "/wechatauth/bindaccount", l, (function(e, a) {
          if ("0" == a.retcode) {
            var n = a.data.token,
              i = a.data.expiretime;
            if (wx.setStorageSync("token", n), wx.setStorageSync("expiretime", i), "wx77c30a197a76fa27" == c) return wx.getStorageSync("isResetPwd") ? void t.$showModal("提示", "登录成功", "前往首页") : void wx.reLaunch({
              url: "/pages/changePwd/changePwd"
            });
            t.$showModal("提示", "登录成功", "前往首页")
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
  getCode: function() {
    var e = this,
      a = e.data,
      n = (a.sendCode, a.custname),
      i = a.stuempno,
      s = a.businessType,
      o = a.staticVerifyText,
      r = a.verifytext,
      d = a.appid;
    if ("" != i && "" != n)
      if ("wx77c30a197a76fa27" != d || o == r) {
        var c = {
            phone: "SchoolMate" == s ? i.trim() : "",
            type: s,
            stuempno: i.trim(),
            custname: n
          },
          u = 60;
        e.setData({
          sendCode: u + "s",
          disabled: !0
        }), t.$requestSync("POST", "/miniprogram/sms/sendVerifyCode", c, (function(t, a) {
          0 == a.retcode ? (wx.showToast({
            title: "短信已发送，请注意查收！",
            icon: "none",
            duration: 3e3
          }), e.data.timer = setInterval((function() {
            0 != u ? (u--, e.setData({
              sendCode: u + "s"
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
        content: "输入的图形验证码有误，请重新输入或点击图片更换验证码",
        showCancel: !1
      });
    else wx.showModal({
      title: "提示",
      content: "姓名或学号不能为空",
      showCancel: !1
    })
  },
  resetPwd: function() {
    var e = this.data,
      t = e.stuempno,
      a = e.custname;
    wx.navigateTo({
      url: "/pages/changePwd/reset?stuempno=".concat(t, "&custname=").concat(a)
    })
  },
  verifyTextChange: function(e) {
    this.setData({
      staticVerifyText: e.detail
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
  },
  getPwd: function(e) {
    this.setData({
      paypwd: e.detail.value
    })
  },
  getVerifyText: function(e) {
    this.setData({
      verifytext: e.detail.value
    })
  }
});