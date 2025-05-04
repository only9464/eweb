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
    sysList: [],
    show: !1,
    sysIndex: 0,
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
    type: wx.getStorageSync("ssltype"),
    productionList: [],
    pIndex: ""
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      a = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "inteFeePay" == t.id && (a = t)
      }))
    })), wx.setNavigationBarTitle({
      title: n.t(a.id, {
        value: "en-US" != this.data.$_locale ? a.title : a.entitle
      })
    });
    var i = wx.getStorageSync("isBindInteroom"),
      s = wx.getStorageSync("enterInteId") ? wx.getStorageSync("enterInteId") : "",
      o = wx.getStorageSync("user") ? wx.getStorageSync("user").stuempno : "";
    i ? this.query() : this.getSystem();
    var r = getApp().globalData.type;
    this.setData({
      type: r,
      enterInteId: s || o
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
  getInteId: function(t) {
    this.setData({
      enterInteId: t.detail.value
    })
  },
  getInteFee: function(t) {
    this.setData({
      inteFee: t.detail.value
    })
  },
  getSystem: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/getnetfeesystem", {}, (function(e, a) {
      var n = a.data ? a.data.data : [],
        i = [];
      n.length && n.forEach((function(t) {
        "停车场缴费" != t.netname && i.push(t)
      })), t.setData({
        sysList: i,
        accountList: wx.getStorageSync("internetFeeAccountList") ? wx.getStorageSync("internetFeeAccountList") : []
      })
    }))
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
      n = wx.getStorageSync("netid"),
      i = a || this.data.enterInteId,
      s = n || (1 === this.data.sysList.length ? 0 : this.data.sysIndex),
      o = n || this.data.sysList[s].netid;
    if (i) {
      var r = {
        netid: o,
        payacc: i
      };
      e.$requestSync("POST", "/miniprogram/querynetfeebalance", r, (function(e, a) {
        if (0 == a.retcode) {
          var n = a.data.retmsg.split(","),
            s = 0;
          n.length >= 2 && "1" == n[0] && (s = Number(n[1] || 0), t.setData({
            inteFee: s,
            isDisabled: !0
          })), t.queryProduction(n), t.getCanUseBank();
          var r = wx.getStorageSync("isBindInteroom");
          if (wx.setStorageSync("enterInteId", i), wx.setStorageSync("netid", o), r) return void t.setData({
            enterInteId: i,
            inteBalance: a.data.balance.replace(/\"/g, ""),
            show: !0
          });
          wx.showModal({
            title: "提示",
            content: "是否绑定当前账号",
            complete: function(e) {
              e.confirm && wx.setStorageSync("isBindInteroom", !0), t.setData({
                inteBalance: a.data.balance.replace(/\"/g, ""),
                show: !0
              }), "1" == n[0] && wx.showModal({
                title: "提示",
                content: "当前账号还未开户需要先支付开户费用",
                showCancel: !1
              })
            }
          })
        }
      }))
    } else wx.showModal({
      title: "错误",
      content: "网费系统或入网账号不能为空",
      showCancel: !1
    })
  },
  queryProduction: function(t) {
    if ("1" != t[0] && t.length >= 2 && "" != t[2]) {
      var e = t[2].split(";"),
        a = [],
        n = 0;
      e.forEach((function(e, i) {
        var s = {};
        s.id = e.split("_")[0], s.name = e.split("_")[1], a.push(s), t[3] == e.split("_")[0] && (n = i)
      })), this.setData({
        productionList: a,
        pIndex: n
      })
    } else this.setData({
      productionList: []
    })
  },
  changePayKind: function(t) {
    this.setData({
      index: t.detail.value
    })
  },
  recharge: a.throttle((function() {
    var t = this;
    if (!e.$isDot(this.data.inteFee)) return wx.showModal({
      title: "错误",
      content: "充入金额有误或充入金额含有小数点",
      showCancel: !1
    }), !1;
    if (this.data.productionList.length > 0 && "" === this.data.pIndex) return wx.showModal({
      title: "提示",
      content: "请选择网络套餐",
      showCancel: !1
    }), !1;
    var a = {
      netid: wx.getStorageSync("netid") || this.data.sysList[this.data.sysIndex].netid,
      payacc: (wx.getStorageSync("enterInteId") || this.data.enterInteId) + (this.data.productionList.length > 0 ? ";" + this.data.productionList[this.data.pIndex].id : ""),
      amount: 100 * this.data.inteFee
    };
    e.$requestSync("POST", "/miniprogram/buynetfeeinit", a, (function(e, a) {
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
              }), wx.showModal({
                title: "提示",
                content: "充值成功",
                showCancel: !1,
                success: function() {
                  that.setData({
                    show: !1
                  })
                }
              })) : 2 != i.billstatus && 1 != i.billstatus && (clearInterval(that.data.setInter), that.setData({
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
  toH5: function() {
    wx.navigateTo({
      url: "/pages/h5/h5?url=" + encodeURIComponent("https://xywzz.hainanu.edu.cn")
    })
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
  chooseProduction: function(t) {
    this.setData({
      pIndex: +t.detail.value
    })
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