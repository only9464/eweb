var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js"),
  n = require("../../utils/throttle.js");
(0, e.getI18nInstance)();
(0, e.I18nPage)({
  data: {
    custname: "",
    stuempno: "",
    idno: "",
    timer: null,
    sendCode: "获取验证码",
    disabled: !1,
    businessType: "MiniprogramLogin",
    verifycode: "",
    appid: "",
    staticVerifyText: "",
    verifytext: ""
  },
  onLoad: function(e) {
    this.setData({
      custname: (null == e ? void 0 : e.custname) || "",
      stuempno: (null == e ? void 0 : e.stuempno) || "",
      appid: wx.getAccountInfoSync().miniProgram.appId
    })
  },
  reset: n.throttle((function(e) {
    var n = e.detail.value,
      i = n.verifycode,
      s = n.custname,
      a = n.stuempno,
      o = n.idno;
    if ("" != i) {
      var r = this.data.businessType,
        d = {
          custname: s.trim(),
          stuempno: a.trim(),
          idno: o.trim(),
          verifycode: i.trim(),
          businessType: r.trim()
        };
      t.$requestSync("POST", "/miniprogram/sms/resetPwd", d, (function(e, t) {
        "0" == t.retcode && wx.showToast({
          title: "重置成功！",
          icon: "none",
          success: function(e) {
            setTimeout((function() {
              wx.navigateBack()
            }), 1500)
          }
        })
      }), {
        isNeedToken: !1
      })
    } else wx.showModal({
      title: "提示",
      content: "请输入验证码",
      showCancel: !1
    })
  }), 3e3),
  getCode: function() {
    var e = this,
      n = e.data,
      i = (n.sendCode, n.custname),
      s = n.stuempno,
      a = n.businessType,
      o = n.staticVerifyText,
      r = n.verifytext,
      d = n.idno;
    if ("" != s && "" != i && "" != d)
      if (o == r) {
        var u = {
            phone: "",
            type: a,
            stuempno: s.trim(),
            custname: i.trim()
          },
          c = 60;
        e.setData({
          sendCode: c + "s",
          disabled: !0
        }), t.$requestSync("POST", "/miniprogram/sms/sendVerifyCode", u, (function(t, n) {
          0 == n.retcode ? (wx.showToast({
            title: "短信已发送，请注意查收！",
            icon: "none",
            duration: 3e3
          }), e.data.timer = setInterval((function() {
            0 != c ? (c--, e.setData({
              sendCode: c + "s"
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
      title: "温馨提示",
      content: "填写信息不完整",
      showCancel: !1
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
  getIdno: function(e) {
    this.setData({
      idno: e.detail.value
    })
  },
  getVerifyText: function(e) {
    this.setData({
      verifytext: e.detail.value
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
  }
});