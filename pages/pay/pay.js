var e = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  t = require("../../utils/throttle.js"),
  n = (0, e.getI18nInstance)();
(0, e.I18nPage)({
  data: {
    showModal: !1,
    status: !1,
    recharge: null,
    customRecharge: "",
    stopClick: !1,
    paykinds: "",
    rechargeList: [{
      id: 0,
      name: "20",
      value: 20,
      checked: !1
    }, {
      id: 1,
      name: "50",
      value: 50,
      checked: !1
    }, {
      id: 2,
      name: "100",
      value: 100,
      checked: !1
    }, {
      id: 3,
      name: "200",
      value: 200,
      checked: !1
    }],
    payKindsList: [{
      bankcode: "wxPay",
      bankname: "微信支付",
      checked: !0,
      url: "/style/images/pay/wx_logo_app.png",
      useflag: !1
    }],
    bankIconList: [{
      id: "ABC",
      url: "/style/images/bindBankCard/ABC.png"
    }, {
      id: "BOC",
      url: "/style/images/bindBankCard/BOC.png"
    }, {
      id: "BCM",
      url: "/style/images/bindBankCard/BOCOM.png"
    }, {
      id: "CCB",
      url: "/style/images/bindBankCard/CCB.png"
    }, {
      id: "ICBC",
      url: "/style/images/bindBankCard/ICBC.png"
    }, {
      id: "wxPay",
      url: "/style/images/pay/wx_logo_app.png"
    }, {
      id: "mp_fd",
      url: "/style/images/pay/wx_logo_app.png"
    }, {
      id: "mp_hn",
      url: "/style/images/pay/wx_logo_app.png"
    }, {
      id: "ABCH5",
      url: "/style/images/pay/bank_ABC.png"
    }, {
      id: "mp_qdcmb",
      url: "/style/images/pay/wx_logo_app.png"
    }, {
      id: "wechat_ccb",
      url: "/style/images/pay/wx_logo_app.png"
    }, {
      id: "ABCH5DR",
      url: "/style/images/pay/sz.png"
    }, {
      id: "dikecmb_h5",
      url: "/style/images/bindBankCard/CMB.png"
    }, {
      id: "dikeicbc_h5",
      url: "/style/images/bindBankCard/ICBC.png"
    }, {
      id: "sicnu_boc_wxmp",
      url: "/style/images/pay/wx_logo_app.png"
    }],
    setInter: "",
    isFocuse: !1,
    type: "",
    enterType: "number",
    appid: "",
    isNoKind: !0,
    consume: "0.00"
  },
  getPwd: function(e) {
    this.setData({
      pwd: e.detail.pwd,
      status: !1
    }), this.bankpay(e)
  },
  close: function() {
    this.setData({
      status: !1
    })
  },
  close_no_bank: function() {
    this.setData({
      showModal: !1
    })
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: n.t("recharge")
    });
    var e = wx.getAccountInfoSync().miniProgram.appId,
      a = "number";
    "wx77c30a197a76fa27" == e && (a = "digit"), this.setData({
      enterType: a,
      appid: e
    }), this.getCanUseBank(), this.isArrears()
  },
  getCanUseBank: function() {
    var e = this;
    a.$requestSync("POST", "/miniprogram/getbanks", {}, (function(a, t) {
      if (0 == t.retcode) {
        var n = t.data.data || [],
          i = e.data.bankIconList;
        if (0 == n.length) return void e.setData({
          isFocuse: !0
        });
        var o = [],
          r = wx.getStorageSync("ssltype");
        n.forEach((function(e) {
          i.forEach((function(a) {
            "BOC" == e.bankcode && "phone" == r && (e.useflag = 0), e.bankcode == a.id && 1 == e.useflag && (e.url = a.url, e.checked = !1, o.push(e))
          }))
        }));
        var s = o.findIndex((function(e) {
          return 1 == e.useflag
        })); - 1 != s && (o[s].checked = !0), e.setData({
          payKindsList: o,
          isFocuse: !0,
          type: r,
          isNoKind: -1 == s
        })
      }
    }))
  },
  pay: t.throttle((function(e) {
    var t = this,
      n = e.detail.value,
      i = n.customRecharge,
      o = n.paykinds;
    return t.setData({
      customRecharge: i,
      paykinds: o
    }), new RegExp("[0-9]", "g").exec(i) && "" != e.detail.value.customRecharge ? i < Math.ceil(this.data.consume) ? void wx.showModal({
      title: "温馨提示",
      content: "充值金额必须大于等于挂账金额",
      showCancel: !1
    }) : a.$isDot(i) || "wx77c30a197a76fa27" == t.data.appid ? void("" != o ? "wxPay" === o ? t.wxpay(e, "normal") : "mp_fd" === o ? t.wxpay(e, "fdabc") : "mp_hn" === o ? t.wxpay(e, "hainanabc") : "mp_qdcmb" === o ? t.wxpay(e, "qdcmb") : "wechat_ccb" === o || "dikecmb_h5" === o || "dikeicbc_h5" === o || "sicnu_boc_wxmp" === o ? t.wxpay(e, o) : "ABCH5" === o || "ABCH5DR" === o ? t.h5Pay(e, "abc_apph5") : a.$requestSync("POST", "/miniprogram/querybankcards", {}, (function(e, a) {
      if (0 == a.retcode) {
        var n = a.data.data,
          i = "";
        if (n.forEach((function(e) {
            i = i + e.route + ","
          })), -1 != i.indexOf(o)) t.setData({
          status: !0
        });
        else {
          var r = wx.getStorageSync("funcPart")[1].funcList;
          wx.getAccountInfoSync().miniProgram.appId;
          try {
            r.forEach((function(e) {
              throw "bindBankCard" == e.id && e.isHave ? (wx.showModal({
                title: "提示",
                content: "该银行卡未绑定",
                confirmText: "去绑定",
                success: function(e) {
                  e.confirm && wx.navigateTo({
                    url: "/pages/addBankCards/addBankCards"
                  })
                }
              }), Error()) : "bindBankCard" != e.id || e.isHave ? "bindBankCardNkd" == e.id ? (wx.showModal({
                title: "提示",
                content: "银行卡未绑定",
                confirmText: "立即绑定",
                success: function(e) {
                  if (e.confirm) {
                    var a = "stuempno=" + wx.getStorageSync("user").stuempno;
                    t.toWebview(a, "schoolorder", "/pages/nkd/H5?id=bindBankCardNkd")
                  }
                }
              }), Error()) : (wx.showModal({
                title: "提示",
                content: "充值失败，银行卡未绑定",
                showCancel: !1
              }), Error()) : (t.setData({
                showModal: !0
              }), Error())
            }))
          } catch (e) {}
        }
      }
    })) : wx.showModal({
      title: "温馨提示",
      content: "请先选择支付方式！",
      showCancel: !1
    })) : (wx.showModal({
      title: "错误",
      content: "充入金额不能含有小数点",
      showCancel: !1
    }), !1) : (wx.showModal({
      title: "错误",
      content: "请充值正确金额",
      showCancel: !1
    }), !1)
  }), 1500),
  bankpay: function(e) {
    var t = this,
      n = t.data,
      i = n.customRecharge,
      o = n.paykinds,
      r = n.pwd,
      s = Number(i),
      c = {
        amount: parseInt(100 * parseFloat(s) + .5),
        bankcode: o
      };
    a.$requestSync("POST", "/miniprogram/bankqcinit", c, (function(e, n) {
      if (0 == n.retcode) {
        var i = {
          refno: n.data.refno,
          bankcode: o,
          pwd: r,
          amount: parseInt(100 * parseFloat(s) + .5)
        };
        a.$requestSync("POST", "/miniprogram/bankqcconfirm", i, (function(e, n) {
          if (0 == n.retcode) {
            var o = 0;
            wx.showLoading({
              title: "请求中",
              mask: !0
            }), clearInterval(t.data.setInter), t.setData({
              setInter: null
            }), t.data.setInter = setInterval((function() {
              o += 1, a.$payRequestSync("POST", "/miniprogram/querychargeresult", {
                refno: i.refno
              }, (function(e, n) {
                if (e)
                  if (200 === n.statusCode) {
                    if (0 == n.data.retcode) {
                      var i = n.data.data;
                      console.log(i.billstatus), 2 == i.billstatus ? (clearInterval(t.data.setInter), t.setData({
                        setInter: null
                      }), wx.hideLoading({
                        complete: function(e) {}
                      }), a.$showModal("提示", "充值成功", "回首页")) : 2 != i.billstatus && 1 != i.billstatus && (clearInterval(t.data.setInter), t.setData({
                        setInter: null
                      }), wx.hideLoading({
                        complete: function(e) {}
                      }), a.$showModal("提示", "充值失败", "回首页"))
                    }
                  } else wx.hideLoading({
                    complete: function(e) {}
                  }), wx.showModal({
                    title: "错误",
                    content: "后台错误 " + n.statusCode,
                    confirmText: "确定",
                    showCancel: !1,
                    duration: 4e3,
                    success: function(e) {}
                  }), clearInterval(t.data.setInter), t.setData({
                    setInter: null
                  });
                else wx.hideLoading({
                  complete: function(e) {}
                }), wx.showModal({
                  title: "错误",
                  content: "后台错误 " + n.statusCode,
                  confirmText: "确定",
                  showCancel: !1,
                  duration: 4e3,
                  success: function(e) {}
                }), clearInterval(t.data.setInter), t.setData({
                  setInter: null
                })
              })), 3 === o && (wx.hideLoading({
                complete: function(e) {}
              }), clearInterval(t.data.setInter), t.setData({
                setInter: null
              }), wx.showModal({
                title: "错误",
                content: "请求超时",
                duration: 4e3
              }))
            }), 3e3)
          }
        }))
      }
    }))
  },
  wxpay: function(e, t) {
    var n = e.detail.value.customRecharge,
      i = Number(n),
      o = {
        amount: parseInt(100 * parseFloat(i) + .5),
        paymethod: "normal" == t ? "" : t
      };
    a.$requestSync("POST", "/miniprogram/wechatcharge", o, (function(e, n) {
      if (0 == n.retcode) {
        if (wx.showLoading({
            title: "请求中",
            mask: !0
          }), "dikecmb_h5" == t || "dikeicbc_h5" == t) return wx.hideLoading(), void wx.navigateTo({
          url: "/pages/h5/h5?url=" + encodeURIComponent(n.data.mwebUrl)
        });
        wx.requestPayment({
          timeStamp: n.data.timeStamp,
          nonceStr: n.data.nonceStr,
          package: n.data.packageValue,
          signType: "normal" == t ? "MD5" : "RSA",
          paySign: n.data.sign,
          success: function(e) {
            wx.hideLoading(), a.$showModal("提示", "充值成功", "回首页")
          },
          fail: function(e) {
            wx.hideLoading({
              complete: function(e) {}
            }), wx.showModal({
              title: "错误",
              content: "充值失败",
              showCancel: !1,
              success: function(e) {}
            })
          }
        })
      }
    }))
  },
  h5Pay: function() {
    var e = this.data,
      t = e.customRecharge,
      n = e.paykinds,
      i = Number(t),
      o = {
        amount: parseInt(100 * parseFloat(i) + .5),
        bankcode: n
      };
    a.$requestSync("POST", "/miniprogram/bankqcinit", o, (function(e, a) {
      if (0 == a.retcode) {
        var t = a.data.weburl;
        t = encodeURIComponent(t), console.log(t), wx.navigateTo({
          url: "/pages/h5/h5?url=" + t
        })
      }
    }))
  },
  toWebview: function(e, t, n) {
    var i = {
      encdata: e,
      encodetype: t
    };
    a.$requestSync("POST", "/miniprogram/doencode", i, (function(e, a) {
      if (0 == a.retcode) {
        var t = a.data;
        wx.navigateTo({
          url: -1 != n.indexOf("?") ? n + "&url=" + t : n + "?url=" + t
        })
      }
    }))
  },
  rechargeChange: function(e) {
    for (var a = this.data.rechargeList, t = a.length, n = 0; n < t; n++) a[n].checked = !1, a[n].value == e.detail.value && (a[n].checked = !0);
    this.setData({
      rechargeList: a,
      recharge: e.detail.value
    })
  },
  onHide: function() {
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  },
  onUnload: function() {
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  },
  getFocus: function() {
    for (var e = this.data.rechargeList, a = e.length, t = 0; t < a; t++) e[t].checked = !1;
    this.setData({
      rechargeList: e,
      recharge: ""
    })
  },
  isArrears: function() {
    var e = this;
    a.$requestSync("POST", "/miniprogram/getArrearsBillData", {}, (function(a, t) {
      if ("0" == t.retcode) {
        var n = t.data.data.totlist || [];
        n.length && e.setData({
          consume: Math.abs(n[0].tot).toFixed(2),
          recharge: Math.ceil(Math.abs(n[0].tot))
        })
      }
    }))
  },
  toArrears: function() {
    wx.navigateTo({
      url: "/pages/turnover/arrears"
    })
  }
});