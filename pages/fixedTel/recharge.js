var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    roomid: "",
    roomname: "",
    degreeIndex: 0,
    amount: "",
    pwd: "",
    billno: "",
    restElecDegree: "",
    status: !1,
    array: [{
      bankname: "卡余额缴费",
      bankcode: "card"
    }],
    username: "",
    index: 0,
    rechargeList: [{
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
      name: "150",
      value: 150,
      checked: !1
    }]
  },
  onLoad: function(t) {
    var a = wx.getStorageSync("funcPart"),
      n = {};
    a.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "fixedTel" == t.id && (n = t)
      }))
    })), wx.setNavigationBarTitle({
      title: e.t(n.id, {
        value: "en-US" != this.data.$_locale ? n.title : n.entitle
      })
    });
    var i = JSON.parse(t.data),
      o = i.username,
      s = o.length > 3 ? o : 3 == o.length ? o.substr(0, 1) + "**" : o.substr(0, 1) + "*";
    this.setData({
      roomid: t.roomid,
      roomname: t.roomid.substr(4),
      balance: i.balance,
      username: s,
      cFdept: i.cFdept,
      build: i.build
    }), this.getCanUseBank()
  },
  getCanUseBank: function() {
    var t = this;
    a.$requestSync("POST", "/miniprogram/getbanks", {}, (function(a, e) {
      if (0 == e.retcode) {
        var n = e.data.data ? e.data.data : [],
          i = t.data.array;
        n.length && n.forEach((function(a, e) {
          a.payflag && (i.push(a), "wxPay" == a.bankcode && t.setData({
            index: t.data.array.length - 1
          }))
        })), t.setData({
          array: i
        })
      }
    }))
  },
  rechargeChange: function(t) {
    for (var a = this.data.rechargeList, e = a.length, n = 0; n < e; n++) a[n].checked = !1, a[n].value == t.detail.value && (a[n].checked = !0);
    this.setData({
      rechargeList: a,
      amount: t.detail.value
    })
  },
  changePayKind: function(t) {
    this.setData({
      index: t.detail.value
    })
  },
  setAmount: function(t) {
    this.setData({
      amount: t.detail.value
    })
  },
  bindDegree: function(t) {
    console.log(t), this.setData({
      degreeIndex: t.detail.value
    })
  },
  doNext: function(t) {
    var e = this,
      n = this.data;
    if (!a.$isDot(n.amount)) return wx.showModal({
      title: "温馨提示",
      content: "缴费金额不能含有小数点",
      showCancel: !1
    }), !1;
    var i = {
      netid: "5",
      payacc: n.roomid ? n.roomid : "",
      amount: 100 * n.amount
    };
    a.$requestSync("POST", "/miniprogram/buynetfeeinit", i, (function(t, a) {
      0 == a.retcode && (e.setData({
        billno: a.data.billno
      }), 0 == n.index ? e.rechargeInit() : "wxPay" == n.array[n.index].bankcode && e.wxpay(a.data.billno))
    }))
  },
  close: function() {
    this.setData({
      status: !1
    })
  },
  wxpay: function(t) {
    var e = this,
      n = e.data.amount,
      i = {
        amount: 100 * Number(n),
        paymethod: "",
        billno: t
      };
    a.$requestSync("POST", "/miniprogram/wechatcharge", i, (function(t, n) {
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
          var n = wx.getStorageSync("fixedTelList") ? wx.getStorageSync("fixedTelList") : [];
          if (0 != n.length)
            if (3 == n.length) n.unshift(e.data.roomid.substr(4)), n.pop();
            else {
              n.forEach((function(t) {
                t != e.data.roomid.substr(4) && n.unshift(e.data.roomid.substr(4))
              }))
            }
          else n.unshift(e.data.roomid.substr(4));
          wx.setStorageSync("fixedTelList", n), a.$showModal("提示", "缴费成功", "回首页")
        },
        fail: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          }), wx.showModal({
            title: "错误",
            content: "缴费失败",
            showCancel: !1,
            success: function(t) {}
          })
        }
      }))
    }))
  },
  rechargeInit: function() {
    var t = this,
      e = {
        elcsysid: t.data.elcsysid,
        areaid: t.data.areaid,
        roomid: t.data.roomid,
        buildid: t.data.buildid ? t.data.buildid : "1",
        roomname: t.data.roomname ? t.data.roomname : "1",
        amount: 100 * t.data.amount,
        pwd: t.data.pwd ? t.data.pwd : "",
        billno: t.data.billno
      };
    a.$requestSync("POST", "/miniprogram/balancepay", e, (function(e, n) {
      wx.hideLoading({
        complete: function(t) {}
      }), e ? 0 == n.data.retcode ? a.$payRequestSync("POST", "/miniprogram/queryelecresult", {
        billno: t.data.billno
      }, (function(e, n) {
        if (e)
          if (200 === n.statusCode) {
            if (0 == n.data.retcode) {
              var i = n.data.data;
              if (2 == i.billstatus) {
                var o = wx.getStorageSync("fixedTelList") ? wx.getStorageSync("fixedTelList") : [];
                if (0 != o.length)
                  if (3 == o.length) o.unshift(t.data.roomid.substr(4)), o.pop();
                  else {
                    o.forEach((function(a) {
                      a != t.data.roomid.substr(4) && o.unshift(t.data.roomid.substr(4))
                    }))
                  }
                else o.unshift(t.data.roomid.substr(4));
                wx.setStorageSync("fixedTelList", o), a.$showModal("提示", "缴费成功", "回首页")
              } else 2 != i.billstatus && 1 != i.billstatus ? a.$showModal("提示", "缴费失败", "回首页") : 1 == n.data.retcode && t.confirm()
            }
          } else wx.showModal({
            title: "错误",
            content: "后台错误 " + n.statusCode,
            confirmText: "确定",
            showCancel: !1,
            duration: 4e3,
            success: function(t) {}
          });
        else wx.showModal({
          title: "错误",
          content: "后台错误 " + n.statusCode,
          confirmText: "确定",
          showCancel: !1,
          duration: 4e3,
          success: function(t) {}
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
      a.$payRequestSync("POST", "/miniprogram/queryelecresult", {
        billno: that.data.billno
      }, (function(e, n) {
        if (e)
          if (200 === n.statusCode) {
            if (t += 1, 0 == n.data.retcode) {
              var i = n.data.data;
              2 == i.billstatus ? (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), a.$showModal("提示", "缴费成功", "回首页")) : 2 != i.billstatus && 1 != i.billstatus && (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), a.$showModal("提示", "缴费失败", "回首页"))
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
    clearInterval(this.data.setInter), this.setData({
      setInter: null
    })
  }
});