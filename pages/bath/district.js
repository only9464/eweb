var t = require("@miniprogram-i18n/core"),
  i = require("../../utils/request.js"),
  e = require("../../utils/throttle");
(0, t.I18nPage)({
  data: {
    district: [],
    districtIndex: "",
    room: [],
    roomIndex: ""
  },
  onLoad: function() {
    this.getDistrict()
  },
  getDistrict: function() {
    var t = this;
    i.$requestSync("POST", "/miniprogram/getShowerDistrict", {}, (function(i, e) {
      i && "0" == e.retcode && t.setData({
        district: e.data.district
      })
    }))
  },
  getRoom: function() {
    var t = this,
      e = this.data,
      o = e.districtIndex,
      r = e.district;
    if (0 != r.length) {
      var n = {
        did: r[o].id
      };
      i.$requestSync("POST", "/miniprogram/getShowerDistrictRoom", n, (function(i, e) {
        i && "0" == e.retcode && t.setData({
          room: e.data.showerroom
        })
      }))
    } else wx.showToast({
      title: "未选择浴室区域！",
      icon: "none"
    })
  },
  bind: e.throttle((function() {
    var t = this.data,
      e = t.roomIndex,
      o = t.room;
    if (0 != o.length) {
      var r = {
        sid: o[e].id
      };
      i.$requestSync("POST", "/miniprogram/watercode/bindwaterdevice", r, (function(t, e) {
        "0" == e.retcode && i.$showModal("提示", e.data.retmsg || "绑定成功", "回首页")
      }))
    } else wx.showToast({
      title: "未选择可绑定浴室！",
      icon: "none"
    })
  }), 3e3),
  getDistrictIndex: function(t) {
    this.setData({
      districtIndex: +t.detail.value
    }), this.getRoom()
  },
  getroomIndex: function(t) {
    this.setData({
      roomIndex: +t.detail.value
    })
  }
});