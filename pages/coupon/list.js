var t = require("../../utils/request.js");
Page({
  data: {
    list: []
  },
  onLoad: function() {
    this.queryCoupon()
  },
  getCoupon: function(e) {
    var a = this,
      o = this.data.list,
      r = e.currentTarget.dataset.index,
      c = {
        cpid: o[r].cpid,
        startdate: o[r].startDate
      };
    t.$requestSync("POST", "/coupon/get", c, (function(t, e) {
      0 == e.retcode && wx.showModal({
        title: "温馨提示",
        content: "领取成功！",
        showCancel: !1,
        success: function() {
          o[r].received = !0, a.setData({
            list: o
          })
        }
      })
    }))
  },
  queryCoupon: function() {
    var e = this;
    t.$requestSync("POST", "/coupon/query", {}, (function(t, a) {
      if (0 == a.retcode) {
        var o = a.data || [];
        o.forEach((function(t) {
          t.date = t.endDate === t.startDate ? "".concat(e.formatDateOrTime(t.startDate), " ").concat(e.formatDateOrTime(t.startTime, "time"), "-").concat(e.formatDateOrTime(t.endTime, "time")) : "".concat(e.formatDateOrTime(t.startDate), "-").concat(e.formatDateOrTime(t.endDate), " ").concat(e.formatDateOrTime(t.startTime, "time"), "-").concat(e.formatDateOrTime(t.endTime, "time")), t.limit = 0 == t.limitVal ? "任意金额使用" : "满".concat(t.limitVal, "元可用")
        })), e.setData({
          list: o
        })
      }
    }))
  },
  toRecords: function() {
    wx.navigateTo({
      url: "/pages/coupon/records"
    })
  },
  formatDateOrTime: function(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "date";
    return "time" == e ? "".concat(t.substr(0, 2), ":").concat(t.substr(2, 2)) : "".concat(t.substr(0, 4), "/").concat(t.substr(4, 2), "/").concat(t.substr(6, 2))
  }
});