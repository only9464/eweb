var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js"),
  n = require("../../utils/throttle.js");
(0, e.getI18nInstance)();
(0, e.I18nPage)({
  data: {
    stuempno: "",
    custname: "",
    sendCode: "获取验证码",
    disabled: !1,
    timer: null,
    businessType: ""
  },
  onLoad: function(e) {
    this.setData({
      businessType: "ApplyVirtualCard"
    })
  },
  bind: n.throttle((function(e) {
    var n = this,
      s = e.detail.value,
      i = s.verifycode,
      a = s.custname,
      o = s.stuempno;
    "" != i ? wx.login({
      complete: function(e) {
        var s = e.code,
          d = wx.getSystemInfoSync().model,
          u = n.data.businessType,
          r = {
            custname: a.trim(),
            phone: o.trim(),
            code: s.trim(),
            model: d.trim(),
            verifycode: i.trim(),
            businessType: u.trim()
          };
        t.$requestSync("POST", "/miniprogram/outsideBindAccount", r, (function(e, t) {
          "0" == t.retcode ? wx.switchTab({
            url: "/pages/index/index"
          }) : n.getCode()
        }), {
          isNeedToken: !1,
          secend: 4e4
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
      n = e.data,
      s = (n.sendCode, n.custname),
      i = n.stuempno,
      a = n.businessType;
    if ("" != i && "" != s) {
      var o = {
          phone: i,
          type: a,
          stuempno: "",
          custname: s
        },
        d = 60;
      e.setData({
        sendCode: d + "s",
        disabled: !0
      }), t.$requestSync("POST", "/miniprogram/sms/sendVerifyCode", o, (function(t, n) {
        0 == n.retcode ? (wx.showToast({
          title: "短信已发送，请注意查收！",
          icon: "none",
          duration: 3e3
        }), e.data.timer = setInterval((function() {
          0 != d ? (d--, e.setData({
            sendCode: d + "s"
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
      content: "姓名或手机号不能为空",
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