require("../@babel/runtime/helpers/Arrayincludes");
var e = require("../@babel/runtime/helpers/objectSpread2");
require("./throttle.js");
var t = "https://eweb.hrbeu.edu.cn/openservice";
wx.$isEmpty = function (e) {
  return !e || e == "undefined" || e == null || e == "";
};
wx.$showModal = function (e, t, n) {
  wx.showModal({
    title: e,
    content: t,
    showCancel: false,
    confirmText: n,
    success: function (e) {
      if (e.confirm) {
        wx.switchTab({
          url: "/pages/index/index"
        });
      }
    }
  });
};
var n = ["normal", "", null, undefined, "erGongYe", "ecnu"];
var o = ["wx77c30a197a76fa27"];
var a = wx.getAccountInfoSync().miniProgram.appId;
var r = false;
var s = [];
wx.$getToken = function () {
  return new Promise(function (e, c) {
    if (wx.getStorageSync("token")) {
      e();
    } else if (r) {
      s.push({
        resolve: e,
        reject: c
      });
    } else {
      r = true;
      wx.login({
        success: function (c) {
          var u = {
            code: c.code,
            stuempno: wx.getStorageSync("user") ? wx.getStorageSync("user").stuempno : ""
          };
          wx.request({
            url: t + "/wechatauth/token",
            data: u,
            method: "POST",
            timeout: 8000,
            header: {
              "content-type": "application/json",
              charset: "utf-8"
            },
            success: function (t) {
              if (t.statusCode === 200) {
                r = false;
                if (t.data.retcode == 9) {
                  wx.clearStorageSync();
                  var c = t.data.data.ssltype;
                  wx.setStorageSync("pwdrule", t.data.data.pwdrule);
                  wx.setStorageSync("ssl", t.data.data.ssl);
                  wx.setStorageSync("ssltype", c);
                  wx.reLaunch({
                    url: o.includes(a) ? "/pages/bind/smsBind" : n.includes(c) ? "/pages/bind/bind" : "/pages/chooseIdentity/chooseIdentity"
                  });
                  return;
                }
                if (t.data.retcode == 0) {
                  var u;
                  wx.setStorageSync("pwdrule", t.data.data.pwdrule);
                  wx.setStorageSync("ssl", true);
                  wx.setStorageSync("ssltype", t.data.data.ssltype);
                  wx.setStorageSync("token", t.data.data.token);
                  wx.setStorageSync("expiretime", t.data.data.expiretime);
                  e();
                  for (; u = s.shift();) {
                    u.resolve();
                  }
                  return;
                }
                if (t.data.retcode == 10) {
                  wx.reLaunch({
                    url: "/pages/neterr/neterr"
                  });
                  return;
                } else {
                  wx.showModal({
                    title: "温馨提示",
                    content: t.data.retmsg,
                    showCancel: false
                  });
                  return;
                }
              }
              if ([504, 503, 502].includes(+t.statusCode)) {
                wx.reLaunch({
                  url: "/pages/neterr/neterr"
                });
              } else {
                wx.showModal({
                  title: "温馨提示",
                  content: t.statusCode + "：获取身份失败",
                  showCancel: false
                });
              }
            },
            fail: function (e) {
              wx.reLaunch({
                url: "/pages/neterr/neterr"
              });
            }
          });
        }
      });
    }
  });
};
wx.$requestSync = function (t, n, o, a) {
  var r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  if ((r = e({
    isShowModal: true,
    isNeedToken: true,
    secend: 8000
  }, r)).isNeedToken) {
    var s = new Date().valueOf();
    var c = wx.getStorageSync("expiretime");
    if (s > c) {
      wx.removeStorageSync("token");
    }
    wx.$getToken().then(function () {
      wx.$request(t, n, o, a, r);
    });
  } else {
    wx.$request(t, n, o, a, r);
  }
};
wx.$toSelf = function () {
  var e = getCurrentPages();
  var t = e[e.length - 1];
  var n = Object.keys(t.options);
  if (n.length > 0) {
    var o = "?";
    n.forEach(function (e, n) {
      o = n === 0 ? o + e + "=" + t.options[e] : o + "&" + e + "=" + t.options[e];
    });
    wx.reLaunch({
      url: "/" + t.route + o
    });
  } else {
    wx.reLaunch({
      url: "/" + t.route
    });
  }
};
wx.$request = function (e, r, s, c, u) {
  var i = wx.getStorageSync("token");
  wx.request({
    url: t + r,
    timeout: u.secend ? u.secend : 8000,
    method: e,
    data: s,
    header: {
      "content-type": "application/json",
      charset: "utf-8",
      "sw-Authorization": u.isNeedToken ? i : ""
    },
    success: function (e) {
      wx.getStorageSync("ssltype");
      wx.getStorageSync("pwdrule");
      if (e.statusCode === 200) {
        var t = e.data.retcode;
        if (t == "0") {
          c(true, e.data);
        } else if (t == "8") {
          var r = wx.getStorageSync("ssltype");
          wx.showModal({
            title: "提示",
            content: e.data.retmsg,
            showCancel: false,
            complete: function (e) {
              wx.removeStorageSync("token");
              wx.reLaunch({
                url: o.includes(a) ? "/pages/bind/smsBind" : n.includes(r) ? "/pages/bind/bind" : "/pages/chooseIdentity/chooseIdentity"
              });
            }
          });
        } else if (t == 10) {
          wx.reLaunch({
            url: "/pages/neterr/neterr"
          });
        } else {
          if (u.isShowModal) {
            wx.showModal({
              title: "温馨提示",
              content: e.data.retmsg,
              showCancel: false
            });
          }
          c(false, e.data);
        }
      } else if (e.statusCode === 403) {
        wx.removeStorageSync("token");
        wx.reLaunch({
          url: "/pages/token/token"
        });
      } else if ([504, 503, 502].includes(e.statusCode)) {
        wx.reLaunch({
          url: "/pages/neterr/neterr"
        });
      } else {
        if (u.isShowModal) {
          wx.showModal({
            title: "温馨提示",
            content: "后台错误 " + e.statusCode,
            confirmText: "确定",
            showCancel: false,
            duration: 4000,
            complete: function (e) {}
          });
        }
        c(false, e.data);
      }
    },
    fail: function (e) {
      wx.reLaunch({
        url: "/pages/neterr/neterr"
      });
    }
  });
};
wx.$payRequest = function (e, n, o, a) {
  var r = wx.getStorageSync("token");
  wx.request({
    url: t + n,
    timeout: 8000,
    method: e,
    data: o,
    header: {
      "content-type": "application/json",
      charset: "utf-8",
      "sw-Authorization": r
    },
    success: function (e) {
      if (a) {
        a(true, e);
      }
    },
    fail: function (e) {
      if (a) {
        a(false, e);
      }
    }
  });
};
wx.$payRequestSync = function (e, t, n, o) {
  var a = wx.getStorageSync("token");
  if (wx.$isEmpty(a)) {
    wx.$getToken().then(function () {
      wx.$payRequest(e, t, n, o);
    });
  } else if (new Date().valueOf() > wx.getStorageSync("expiretime")) {
    wx.$getToken().then(function (a) {
      wx.$payRequest(e, t, n, o);
    });
  } else {
    wx.$payRequest(e, t, n, o);
  }
};
wx.$isDot = function (e) {
  if (e === "" || e == null || !e) {
    return false;
  }
  e.toString().indexOf(".");
  return e.toString().indexOf(".") < 0;
};
module.exports = {
  $getToken: wx.$getToken,
  $isEmpty: wx.$isEmpty,
  $requestSync: wx.$requestSync,
  $showModal: wx.$showModal,
  $isDot: wx.$isDot,
  $payRequestSync: wx.$payRequestSync,
  baseUrl: t
};