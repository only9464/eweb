var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = require("../../utils/throttle.js"),
  n = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    inteBalance: "",
    userName: "",
    enterInteId: "",
    inteFee: "",
    sysList: [{
      netname: "哈尔滨网费",
      id: 1
    }, {
      netname: "烟台网费",
      id: 3
    }],
    show: !1,
    sysIndex: "",
    pwd: "",
    billno: "",
    setInter: "",
    status: !1,
    array: [{
      bankname: "卡余额充值",
      bankcode: "card"
    }],
    index: 0,
    accountList: [],
    isDisabled: !1,
    rechargeList: [{
      id: 1,
      name: "40",
      value: 40,
      checked: !1
    }, {
      id: 2,
      name: "80",
      value: 80,
      checked: !1
    }, {
      id: 3,
      name: "120",
      value: 120,
      checked: !1
    }, {
      id: 4,
      name: "240",
      value: 240,
      checked: !1
    }]
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      a = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "inteFeePayHgc" == t.id && (a = t)
      }))
    })), wx.setNavigationBarTitle({
      title: n.t(a.id, {
        value: "en-US" != this.data.$_locale ? a.title : a.entitle
      })
    });
    var i = wx.getStorageSync("isBindInteroom");
    wx.getStorageSync("enterInteId");
    i ? (this.setData({
      sysIndex: wx.getStorageSync("netid")
    }), this.query()) : this.setData({
      accountList: wx.getStorageSync("internetFeeAccountList") ? wx.getStorageSync("internetFeeAccountList") : []
    })
  },
  rechargeChange: function(t) {
    for (var e = this.data.rechargeList, a = e.length, n = 0; n < a; n++) e[n].checked = !1, e[n].value == t.detail.value && (e[n].checked = !0);
    this.setData({
      rechargeList: e,
      inteFee: t.detail.value
    })
  },
  getCanUseBank: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/getbanks", {}, (function(e, a) {
      if (0 == a.retcode) {
        var n = a.data.data ? a.data.data : [],
          i = t.data.array;
        n.length && n.forEach((function(e) {
          e.payflag && (i.push(e), "wxPay" == e.bankcode && t.setData({
            index: t.data.array.length - 1
          }))
        })), t.setData({
          array: i
        })
      }
    }))
  },
  getInteFee: function(t) {
    this.setData({
      inteFee: t.detail.value
    })
  },
  getInteId: function(t) {
    this.setData({
      enterInteId: t.detail.value
    })
  },
  setAccount: function(t) {
    this.setData({
      enterInteId: t.currentTarget.dataset.account
    })
  },
  bindsysChange: function(t) {
    this.data.sysList.length && this.setData({
      sysIndex: t.detail.value
    })
  },
  query: function() {
    var t = this,
      a = wx.getStorageSync("enterInteId"),
      n = t.data.sysIndex || wx.getStorageSync("netid"),
      i = a || t.data.enterInteId;
    if ("" != i && "" != n)
      if (i) {
        var s = {
          netid: t.data.sysList[n].id,
          payacc: i
        };
        e.$requestSync("POST", "/miniprogram/querynetfeebalance", s, (function(e, a) {
          if (0 == a.retcode) {
            var s = a.data.retmsg.split(","),
              o = 0;
            s.length >= 2 && "1" == s[0] && (o = Number(s[1] ? s[1] : 0), t.setData({
              inteFee: o,
              isDisabled: !0
            })), t.getCanUseBank();
            var r = wx.getStorageSync("isBindInteroom");
            wx.setStorageSync("enterInteId", i), wx.setStorageSync("netid", n), r ? t.setData({
              enterInteId: i,
              inteBalance: a.data.balance.replace(/\"/g, ""),
              show: !0
            }) : (wx.showModal({
              title: "提示",
              content: "是否绑定当前账号",
              cancelText: "否",
              confirmText: "是",
              complete: function(e) {
                e.confirm && wx.setStorageSync("isBindInteroom", !0), t.setData({
                  inteBalance: a.data.balance.replace(/\"/g, ""),
                  show: !0
                })
              }
            }), "1" == s[0] && wx.showModal({
              title: "提示",
              content: "当前账号还未开户需要先支付开户费用",
              showCancel: !1
            }))
          }
        }))
      } else wx.showModal({
        title: "错误",
        content: "网费系统或入网账号不能为空",
        showCancel: !1
      });
    else wx.showModal({
      title: "温馨提示",
      content: "请选择网费系统或填写入网账号",
      showCancel: !1
    })
  },
  changePayKind: function(t) {
    this.setData({
      index: t.detail.value
    })
  },
  recharge: a.throttle((function() {
    var t = this;
    if (!e.$isDot(t.data.inteFee)) return wx.showModal({
      title: "错误",
      content: "充入金额不能含有小数点",
      showCancel: !1
    }), !1;
    var a = wx.getStorageSync("enterInteId"),
      n = {
        netid: t.data.sysList[t.data.sysIndex].id,
        payacc: a || t.data.enterInteId,
        amount: 100 * t.data.inteFee
      };
    e.$requestSync("POST", "/miniprogram/buynetfeeinit", n, (function(e, a) {
      wx.showLoading({
        title: "正在支付...",
        mask: !0
      }), 0 == a.retcode && (t.setData({
        billno: a.data.billno
      }), 0 == t.data.index ? t.rechargeInit() : "wxPay" == t.data.array[t.data.index].bankcode && t.wxpay(a.data.billno))
    }))
  }), 5e3),
  wxpay: function(t) {
    var a = this,
      n = a.data.inteFee,
      i = {
        amount: 100 * Number(n),
        paymethod: "",
        billno: t
      };
    e.$requestSync("POST", "/miniprogram/wechatcharge", i, (function(t, n) {
      0 == n.retcode && (wx.showLoading({
        title: "请求中",
        mask: !0
      }), wx.requestPayment({
        timeStamp: n.data.timeStamp,
        nonceStr: n.data.nonceStr,
        package: n.data.packageValue,
        signType: "MD5",
        paySign: n.data.sign,
        success: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          });
          var n = wx.getStorageSync("internetFeeAccountList") ? wx.getStorageSync("internetFeeAccountList") : [];
          if (0 != n.length)
            if (3 == n.length) n.unshift(a.data.enterInteId), n.pop();
            else {
              n.forEach((function(t) {
                t != a.data.enterInteId && n.unshift(a.data.enterInteId)
              }))
            }
          else n.unshift(a.data.enterInteId);
          wx.setStorageSync("internetFeeAccountList", n), e.$showModal("提示", "充值成功", "回首页")
        },
        fail: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          }), wx.showModal({
            title: "错误",
            content: "充值失败",
            showCancel: !1,
            success: function(t) {}
          })
        }
      }))
    }))
  },
  rechargeInit: function() {
    var t = this,
      a = {
        amount: 100 * t.data.inteFee,
        pwd: t.data.pwd,
        billno: t.data.billno
      };
    e.$requestSync("POST", "/miniprogram/balancepay", a, (function(a, n) {
      wx.hideLoading({
        complete: function(t) {}
      }), a ? 0 == n.data.retcode ? e.$payRequestSync("POST", "/miniprogram/querynetfeeresult", {
        billno: t.data.billno
      }, (function(a, n) {
        if (a)
          if (200 === n.statusCode) {
            if (0 == n.data.retcode) {
              var i = n.data.data;
              if (2 == i.billstatus) {
                var s = wx.getStorageSync("internetFeeAccountList") ? wx.getStorageSync("internetFeeAccountList") : [];
                if (0 != s.length)
                  if (3 == s.length) s.unshift(t.data.enterInteId), s.pop();
                  else {
                    s.forEach((function(e) {
                      e != t.data.enterInteId && s.unshift(t.data.enterInteId)
                    }))
                  }
                else s.unshift(t.data.enterInteId);
                wx.setStorageSync("internetFeeAccountList", s), e.$showModal("提示", "充值成功", "回首页")
              } else 2 != i.billstatus && 1 != i.billstatus ? e.$showModal("提示", "充值失败", "回首页") : 1 == i.billstatus && t.confirm()
            }
          } else wx.showModal({
            title: "错误",
            content: "后台错误 " + n.statusCode,
            confirmText: "确定",
            showCancel: !1,
            duration: 4e3
          });
        else wx.showModal({
          title: "错误",
          content: "后台错误 " + n.statusCode,
          confirmText: "确定",
          showCancel: !1,
          duration: 4e3
        })
      })) : 77 == n.data.retcode && t.setData({
        status: !0
      }) : t.setData({
        pwd: ""
      })
    }))
  },
  confirm: function() {
    wx.showLoading({
      title: "请求中",
      mask: !0
    }), clearInterval(that.data.setInter), that.setData({
      setInter: null
    });
    var t = 0;
    that.data.setInter = setInterval((function() {
      e.$payRequestSync("POST", "/miniprogram/querynetfeeresult", {
        billno: that.data.billno
      }, (function(a, n) {
        if (a)
          if (200 === n.statusCode) {
            if (t += 1, 0 == n.data.retcode) {
              var i = n.data.data;
              2 == i.billstatus ? (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), e.$showModal("提示", "充值成功", "回首页")) : 2 != i.billstatus && 1 != i.billstatus && (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), e.$showModal("提示", "充值失败", "回首页"))
            }
          } else wx.hideLoading({
            complete: function(t) {}
          }), wx.showModal({
            title: "错误",
            content: "后台错误 " + n.statusCode,
            confirmText: "确定",
            showCancel: !1,
            duration: 4e3,
            success: function(t) {}
          }), clearInterval(that.data.setInter), that.setData({
            setInter: null
          });
        else wx.hideLoading({
          complete: function(t) {}
        }), wx.showModal({
          title: "错误",
          content: "后台错误 " + n.statusCode,
          confirmText: "确定",
          showCancel: !1,
          duration: 4e3,
          success: function(t) {}
        }), clearInterval(that.data.setInter), that.setData({
          setInter: null
        });
        3 === t && (wx.hideLoading({
          complete: function(t) {}
        }), clearInterval(that.data.setInter), that.setData({
          setInter: null
        }), wx.showModal({
          title: "错误",
          content: "请求超时",
          duration: 4e3
        }))
      }))
    }), 3e3)
  },
  backtosys: function() {
    wx.removeStorageSync("isBindInteroom"), wx.removeStorageSync("enterInteId"), wx.removeStorageSync("netid"), this.setData({
      show: !1
    }), this.getSystem()
  },
  close: function() {
    this.setData({
      status: !1
    })
  },
  getPwd: function(t) {
    this.setData({
      pwd: t.detail.pwd,
      status: !1
    }), this.rechargeInit()
  },
  getPwdToPay: function(t) {
    this.setData({
      pwd: t.detail.pwd,
      status: !1
    }), this.rechargeInit()
  },
  onHide: function() {
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  },
  onUnload: function() {
    wx.getStorageSync("isBindInteroom") || (wx.removeStorageSync("enterInteId"), wx.removeStorageSync("netid"));
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  }
});