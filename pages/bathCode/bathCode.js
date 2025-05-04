var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js"),
  a = (0, e.getI18nInstance)();
(0, e.I18nPage)({
  data: {
    backgroud_color_list: ["#FF726A", "#379EFB", "#53CE8D"],
    button_color_list: ["#FF8E88", "#5FB1FC", "#75D8A4"],
    name: "",
    device_list: [],
    watercode: "",
    isShow: !1,
    type: wx.getStorageSync("ssltype"),
    array: ["个人浴室绑定", "集中浴室绑定"]
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: a.t("bathCode")
    }), this.get_device_list();
    var e = wx.getStorageSync("user").name ? wx.getStorageSync("user").name : "未知";
    e = e.substr(0, 1) + "*" + (e.length > 2 ? e.substr(2, e.length - 2) : ""), this.setData({
      name: e
    });
    var t = wx.getStorageSync("funcPart"),
      i = {};
    t.forEach((function(e) {
      e.funcList && e.funcList.forEach((function(e) {
        "bathCode" == e.id && (i = e)
      }))
    })), this.setData({
      obj: i
    }), wx.setNavigationBarTitle({
      title: a.t(i.id, {
        value: "en-US" != this.data.$_locale ? i.title : i.entitle
      })
    })
  },
  getChoice: function(e) {
    "0" == e.detail.value ? this.add_device() : wx.navigateTo({
      url: "/pages/bath/district"
    })
  },
  get_device_list: function() {
    var e = this;
    t.$requestSync("POST", "/miniprogram/watercode/getuserwatercode", {}, (function(t, a) {
      if (t) {
        var i, o, n, c = (null === (i = a.data) || void 0 === i ? void 0 : i.device) || [],
          r = (null === (o = a.data) || void 0 === o ? void 0 : o.showerroom) || [];
        c.forEach((function(e) {
          e.type = "device"
        })), r.forEach((function(e) {
          e.type = "shower"
        }));
        var d = c.concat(r);
        e.setData({
          device_list: d,
          watercode: null === (n = a.data) || void 0 === n ? void 0 : n.watercode
        })
      }
    }))
  },
  generatewatercode: function() {
    var e = this;
    t.$requestSync("POST", "/miniprogram/watercode/generatewatercode", {}, (function(t, a) {
      "0" == a.retcode && wx.showToast({
        title: "刷新成功",
        icon: "none",
        complete: function() {
          e.setData({
            watercode: a.data.watercode
          })
        }
      })
    }))
  },
  change_status: function() {
    this.setData({
      isShow: !this.data.isShow
    })
  },
  add_device: function() {
    var e = this;
    wx.scanCode({
      onlyFromCamera: !0,
      success: function(a) {
        var i = a.result;
        t.$requestSync("POST", "/miniprogram/checkwaterqrcode", {
          qrcode: i
        }, (function(a, i) {
          if ("0" == i.retcode) {
            var o = i.data.codetype,
              n = i.data.url,
              c = {
                devphyid: "getDeviceFromUrl" == o ? n : "",
                qrcode: "bath" == o ? n : ""
              };
            t.$requestSync("POST", "/miniprogram/watercode/bindwaterdevice", c, (function(t, a) {
              if ("0" == a.retcode) {
                e.get_device_list();
                wx.navigateTo({
                  url: "/pages/bindBathCode/bindBathCode?code="
                })
              }
            }))
          }
        }))
      },
      fail: function(e) {
        wx.showToast({
          title: "二维码识别失败",
          icon: "none"
        })
      }
    })
  },
  query: function(e) {
    var t = e.currentTarget.dataset.device;
    wx.navigateTo({
      url: "/pages/bath/detail?id=".concat(t.id, "&name=").concat(t.name)
    })
  },
  unbind: function(e) {
    var a = this,
      i = e.currentTarget.dataset.index,
      o = a.data.device_list[i],
      n = {
        devphyid: "device" == o.type ? o.id : "",
        showerroomid: "shower" == o.type ? o.id : ""
      };
    wx.showModal({
      title: "提示",
      content: "确定要解除绑定吗？",
      success: function(e) {
        e.confirm && t.$requestSync("POST", "/miniprogram/watercode/custunbind", n, (function(e, t) {
          "0" === t.retcode && wx.showModal({
            title: "提示",
            content: "解绑成功",
            showCancel: !1,
            success: function(e) {
              if (e.confirm) {
                var t = a.data.device_list;
                t.splice(i, 1), a.setData({
                  device_list: t
                })
              }
            }
          })
        }))
      }
    })
  }
});