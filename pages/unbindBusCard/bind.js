var a = require("../../utils/request.js");
Page({
  data: {
    showExample: !1,
    isBind: !0,
    isSuccess: !0,
    respMsg: "",
    disabled: !1,
    cardNo: "",
    user: {}
  },
  onLoad: function() {
    this.setData({
      user: wx.getStorageSync("user")
    })
  },
  bind: function() {
    var s = this;
    this.setData({
      disabled: !0
    });
    var e = this.data.cardNo;
    if ("" == e || e.length < 11) wx.showToast({
      title: "输入卡号长度有误",
      icon: "none",
      duration: 1500,
      success: function() {
        s.setData({
          disabled: !1
        })
      }
    });
    else {
      var t = {
        cardNo: e,
        cardType: "BusCard"
      };
      a.$requestSync("POST", "/miniprogram/bindThirdCard", t, (function(a, e) {
        var t;
        a ? e && e.data && "0" == e.data.retcode ? s.setData({
          isBind: !1,
          respMsg: e.data.retmsg || "绑定成功！",
          disabled: !1
        }) : s.setData({
          isBind: !1,
          respMsg: (null === (t = e.data) || void 0 === t ? void 0 : t.retmsg) || "绑定失败！",
          isSuccess: !1,
          disabled: !1
        }) : s.setData({
          disabled: !1
        })
      }), {
        isShowModal: !1,
        isNeedToken: !0
      })
    }
  },
  changePopup: function() {
    this.setData({
      showExample: !this.data.showExample
    })
  },
  back: function() {
    wx.reLaunch({
      url: "/pages/unbindBusCard/unbind"
    })
  },
  getCardNo: function(a) {
    this.setData({
      cardNo: a.detail.value
    })
  }
});