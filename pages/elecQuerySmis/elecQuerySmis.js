var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js"),
  o = (0, e.getI18nInstance)();
(0, e.I18nPage)({
  data: {
    roomid: "",
    show: !0,
    showRule: !0,
    type: ""
  },
  onLoad: function(e) {
    var t = wx.getStorageSync("funcPart"),
      i = {};
    t.forEach((function(e) {
      e.funcList && e.funcList.forEach((function(e) {
        "elecQuerySmis" == e.id && (i = e)
      }))
    })), wx.setNavigationBarTitle({
      title: o.t(i.id, {
        value: "en-US" != this.data.$_locale ? i.title : i.entitle
      })
    }), "上海海事大学" == wx.getStorageSync("header").schoolName && this.setData({
      show: !1
    }), this.setData({
      type: wx.getStorageSync("ssltype")
    })
  },
  getRoomid: function(e) {
    this.setData({
      roomid: e.detail.value
    })
  },
  doNext: function() {
    var e = this.data.roomid;
    if (t.$isEmpty(e)) return wx.showModal({
      title: "错误",
      content: "您的房间号不能为空",
      succuss: function(e) {}
    }), !1;
    var o = {
      elcsysid: "1",
      areaid: "1",
      roomid: e,
      buildid: "1"
    };
    t.$requestSync("POST", "/miniprogram/queryroominfo", o, (function(e, i) {
      "0" == i.retcode && (t.$isEmpty(wx.getStorageSync("isBindEleroom")) || wx.removeStorageSync("isBindEleroom"), wx.showModal({
        title: "提示",
        content: "是否绑定当前房间",
        cancelText: "否",
        confirmText: "是",
        complete: function(e) {
          wx.setStorageSync("elec_type", 2), e.confirm ? (wx.setStorageSync("isBindEleroom", JSON.stringify(o)), wx.navigateTo({
            url: "/pages/elecharge/elecharge"
          })) : e.cancel && (wx.setStorageSync("roomData", JSON.stringify(i.data)), wx.navigateTo({
            url: "/pages/elecharge/elecharge"
          }))
        }
      }))
    }))
  }
});