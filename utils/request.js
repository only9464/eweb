require("../@babel/runtime/helpers/Arrayincludes");
var e = require("../@babel/runtime/helpers/objectSpread2"),
  t = (require("./throttle.js"), "https://eweb.hrbeu.edu.cn/openservice");
wx.$isEmpty = function(e) {
  return !e || "undefined" == e || null == e || "" == e
}, wx.$showModal = function(e, t, n) {
  wx.showModal({
    title: e,
    content: t,
    showCancel: !1,
    confirmText: n,
    success: function(e) {
      e.confirm && wx.switchTab({
        url: "/pages/index/index"
      })
    }
  })
};
var n = ["normal", "", null, void 0, "erGongYe", "ecnu"],
  o = ["wx77c30a197a76fa27"],
  a = wx.getAccountInfoSync().miniProgram.appId,
  r = !1,
  s = [];
wx.$getToken = function() {
  return new Promise((function(e, c) {
    wx.getStorageSync("token") ? e() : r ? s.push({
      resolve: e,
      reject: c
    }) : (r = !0, wx.login({
      success: function(c) {
        var u = {
          code: c.code,
          stuempno: wx.getStorageSync("user") ? wx.getStorageSync("user").stuempno : ""
        };
        wx.request({
          url: t + "/wechatauth/token",
          data: u,
          method: "POST",
          timeout: 8e3,
          header: {
            "content-type": "application/json",
            charset: "utf-8"
          },
          success: function(t) {
            if (200 === t.statusCode) {
              if (r = !1, 9 == t.data.retcode) {
                wx.clearStorageSync();
                var c = t.data.data.ssltype;
                return wx.setStorageSync("pwdrule", t.data.data.pwdrule), wx.setStorageSync("ssl", t.data.data.ssl), wx.setStorageSync("ssltype", c), void wx.reLaunch({
                  url: o.includes(a) ? "/pages/bind/smsBind" : n.includes(c) ? "/pages/bind/bind" : "/pages/chooseIdentity/chooseIdentity"
                })
              }
              if (0 == t.data.retcode) {
                var u;
                for (wx.setStorageSync("pwdrule", t.data.data.pwdrule), wx.setStorageSync("ssl", !0), wx.setStorageSync("ssltype", t.data.data.ssltype), wx.setStorageSync("token", t.data.data.token), wx.setStorageSync("expiretime", t.data.data.expiretime), e(); u = s.shift();) u.resolve();
                return
              }
              return 10 == t.data.retcode ? void wx.reLaunch({
                url: "/pages/neterr/neterr"
              }) : void wx.showModal({
                title: "温馨提示",
                content: t.data.retmsg,
                showCancel: !1
              })
            } [504, 503, 502].includes(+t.statusCode) ? wx.reLaunch({
              url: "/pages/neterr/neterr"
            }) : wx.showModal({
              title: "温馨提示",
              content: t.statusCode + "：获取身份失败",
              showCancel: !1
            })
          },
          fail: function(e) {
            wx.reLaunch({
              url: "/pages/neterr/neterr"
            })
          }
        })
      }
    }))
  }))
}, wx.$requestSync = function(t, n, o, a) {
  var r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
  if ((r = e({
      isShowModal: !0,
      isNeedToken: !0,
      secend: 8e3
    }, r)).isNeedToken) {
    var s = (new Date).valueOf(),
      c = wx.getStorageSync("expiretime");
    s > c && wx.removeStorageSync("token"), wx.$getToken().then((function() {
      wx.$request(t, n, o, a, r)
    }))
  } else wx.$request(t, n, o, a, r)
}, wx.$toSelf = function() {
  var e = getCurrentPages(),
    t = e[e.length - 1],
    n = Object.keys(t.options);
  if (n.length > 0) {
    var o = "?";
    n.forEach((function(e, n) {
      o = 0 === n ? o + e + "=" + t.options[e] : o + "&" + e + "=" + t.options[e]
    })), wx.reLaunch({
      url: "/" + t.route + o
    })
  } else wx.reLaunch({
    url: "/" + t.route
  })
}, wx.$request = function(e, r, s, c, u) {
  var i = wx.getStorageSync("token");
  wx.request({
    url: t + r,
    timeout: u.secend ? u.secend : 8e3,
    method: e,
    data: s,
    header: {
      "content-type": "application/json",
      charset: "utf-8",
      "sw-Authorization": u.isNeedToken ? i : ""
    },
    success: function(e) {
      wx.getStorageSync("ssltype"), wx.getStorageSync("pwdrule");
      if (200 === e.statusCode) {
        var t = e.data.retcode;
        if ("0" == t) c(!0, e.data);
        else if ("8" == t) {
          var r = wx.getStorageSync("ssltype");
          wx.showModal({
            title: "提示",
            content: e.data.retmsg,
            showCancel: !1,
            complete: function(e) {
              wx.removeStorageSync("token"), wx.reLaunch({
                url: o.includes(a) ? "/pages/bind/smsBind" : n.includes(r) ? "/pages/bind/bind" : "/pages/chooseIdentity/chooseIdentity"
              })
            }
          })
        } else 10 == t ? wx.reLaunch({
          url: "/pages/neterr/neterr"
        }) : (u.isShowModal && wx.showModal({
          title: "温馨提示",
          content: e.data.retmsg,
          showCancel: !1
        }), c(!1, e.data))
      } else 403 === e.statusCode ? (wx.removeStorageSync("token"), wx.reLaunch({
        url: "/pages/token/token"
      })) : [504, 503, 502].includes(e.statusCode) ? wx.reLaunch({
        url: "/pages/neterr/neterr"
      }) : (u.isShowModal && wx.showModal({
        title: "温馨提示",
        content: "后台错误 " + e.statusCode,
        confirmText: "确定",
        showCancel: !1,
        duration: 4e3,
        complete: function(e) {}
      }), c(!1, e.data))
    },
    fail: function(e) {
      wx.reLaunch({
        url: "/pages/neterr/neterr"
      })
    }
  })
}, wx.$payRequest = function(e, n, o, a) {
  var r = wx.getStorageSync("token");
  wx.request({
    url: t + n,
    timeout: 8e3,
    method: e,
    data: o,
    header: {
      "content-type": "application/json",
      charset: "utf-8",
      "sw-Authorization": r
    },
    success: function(e) {
      a && a(!0, e)
    },
    fail: function(e) {
      a && a(!1, e)
    }
  })
}, wx.$payRequestSync = function(e, t, n, o) {
  var a = wx.getStorageSync("token");
  wx.$isEmpty(a) ? wx.$getToken().then((function() {
    wx.$payRequest(e, t, n, o)
  })) : (new Date).valueOf() > wx.getStorageSync("expiretime") ? wx.$getToken().then((function(a) {
    wx.$payRequest(e, t, n, o)
  })) : wx.$payRequest(e, t, n, o)
}, wx.$isDot = function(e) {
  if ("" === e || null == e || !e) return !1;
  e.toString().indexOf(".");
  return e.toString().indexOf(".") < 0
}, module.exports = {
  $getToken: wx.$getToken,
  $isEmpty: wx.$isEmpty,
  $requestSync: wx.$requestSync,
  $showModal: wx.$showModal,
  $isDot: wx.$isDot,
  $payRequestSync: wx.$payRequestSync,
  baseUrl: t
};