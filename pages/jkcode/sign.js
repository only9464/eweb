var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js");
require("../../utils/util.js"), (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    routeKinds: ["在校（状态正常）", "在校（处于管控状态）", "在沪内非管控区", "在沪外非管控区", "在沪内管控区", "在沪外管控区", "旅途中"],
    status: ["14日内，在高、中风险地区逗留过的", "目前在中、高风险区", "目前为密切接触者（密接）", "目前为密切接触者的密切接触者（次密）", "目前为一般接触者（高危筛查对象）", "无"],
    jkstatus: ["良好", "发热、咳嗽、头疼、乏力、呼吸困难", "确诊新型肺炎", "疑似新型肺炎"],
    jkStatusIndex: "0",
    statusIndex: "0",
    routeKindsIndex: "0",
    address: "",
    user: {},
    form: {},
    record: "",
    street: ""
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("EpidemicSign");
    console.log(e);
    var s = t.n ? t.n : wx.getStorageSync("user").name,
      n = t.s ? t.s : wx.getStorageSync("user").stuempno;
    this.setData({
      form: e,
      jkStatusIndex: e.jkStatusIndex ? Number(e.jkStatusIndex) : "0",
      statusIndex: e.statusIndex ? Number(e.statusIndex) : "0",
      routeKindsIndex: e.routeKindsIndex ? Number(e.routeKindsIndex) : "0",
      user: {
        name: s,
        stuempno: n
      }
    }), this.getDtl(n)
  },
  statusChange: function(t) {
    this.setData({
      statusIndex: Number(t.detail.value)
    })
  },
  jkChange: function(t) {
    this.setData({
      jkStatusIndex: Number(t.detail.value)
    })
  },
  kindChange: function(t) {
    this.setData({
      routeKindsIndex: Number(t.detail.value)
    })
  },
  getLocation: function() {
    var t = this;
    wx.getLocation({
      success: function(e) {
        var s = e.latitude,
          n = e.longitude,
          a = "https://apis.map.qq.com/ws/geocoder/v1/?location=".concat(s, ",").concat(n, "&key=").concat("JPIBZ-II3CF-525JC-NOQ5G-JG5G6-H5FXK");
        wx.request({
          url: a,
          success: function(e) {
            if (0 == e.data.status) {
              var s = e.data.result.address,
                n = e.data.result.address_component.street;
              t.setData({
                address: s,
                street: n
              })
            } else wx.showModal({
              title: "提示",
              content: e.data.message || "定位失败",
              showCancel: !1
            })
          }
        })
      }
    })
  },
  toRecords: function() {
    wx.navigateTo({
      url: "/pages/jkcode/records"
    })
  },
  submit: function(t) {
    var e = t.detail.value;
    for (var s in e)
      if ("resiveposition" != s && "remark" != s && "" == e[s] && !e[s]) return wx.showToast({
        title: "签到信息未完善，请确认后重新提交",
        icon: "none"
      }), !1;
    if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(e.phone)) {
      e.triptype = this.data.routeKinds[e.routeKindsIndex], e.symptom = this.data.status[e.statusIndex], e.healthtype = this.data.jkstatus[e.jkStatusIndex], console.log(e), "4" !== e.routeKindsIndex && (e.tourarea = "", e.tourvehicle = "");
      var n = this;
      n.data.record.substr(0, 10) == n.timeFormat((new Date).getTime()).substr(0, 10) ? wx.showModal({
        title: "温馨提示",
        content: "今天已完成过疫情签到，是否要继续提交？",
        success: function(t) {
          t.confirm && n.sign(e)
        }
      }) : n.sign(e)
    } else wx.showToast({
      title: "手机号码格式不正确！",
      icon: "none"
    })
  },
  sign: function(t) {
    e.$requestSync("POST", "/miniprogram/savaEpidemicSign", t, (function(s, n) {
      "0" == n.retcode && (wx.setStorageSync("EpidemicSign", t), wx.setStorageSync("recordTime", (new Date).getTime()), e.$showModal("温馨提示", "签到成功", "返回首页"))
    }))
  },
  getRecords: function(t) {
    var s = this;
    e.$requestSync("POST", "/miniprogram/epidemicSignDtlForday", {
      stuempno: t
    }, (function(t, e) {
      if ("0" == e.retcode) {
        var n = wx.getStorageSync("recordTime"),
          a = null != e.data && 0 != e.data.length ? s.timeFormat(e.data[0].submittime) : n ? s.timeFormat(n) : "";
        s.setData({
          record: a
        })
      }
    }))
  },
  getDtl: function(t) {
    var s = this,
      n = {
        stuempno: t,
        pageno: 1,
        pagesize: 1
      };
    e.$requestSync("POST", "/miniprogram/getEpidemicSignDtl", n, (function(t, e) {
      var n = "";
      if ("0" == e.retcode) {
        var a = e.data.list;
        if (a.length) {
          var i = a[0].submittime;
          n = s.timeFormat(i)
        }
      }
      s.setData({
        record: n
      })
    }))
  },
  timeFormat: function(t) {
    console.log(t);
    var e = new Date(parseInt(t)),
      s = e.getFullYear(),
      n = this.isOutTen(e.getMonth() + 1),
      a = this.isOutTen(e.getDate()),
      i = this.isOutTen(e.getHours()),
      o = this.isOutTen(e.getMinutes()),
      r = this.isOutTen(e.getSeconds());
    return [s, n, a].join("-") + " " + [i, o, r].join(":")
  },
  isOutTen: function(t) {
    return t < 10 ? "0" + t : t
  },
  toUse: function() {
    wx.navigateTo({
      url: "/pages/jkcode/use"
    })
  }
});