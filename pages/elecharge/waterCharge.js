var t = require("@miniprogram-i18n/core"),
  a = require("../../utils/request.js"),
  e = require("../../utils/throttle.js"),
  n = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    roomid: "",
    roomname: "",
    degreeIndex: 0,
    areaid: "",
    elcsysid: "",
    elecode: "",
    buildid: "",
    amount: "",
    pwd: "",
    billno: "",
    restElecDegree: "",
    status: !1,
    array: [{
      bankname: "卡余额缴费",
      bankcode: "card"
    }],
    index: 0
  },
  onLoad: function(t) {
    var a = wx.getStorageSync("funcPart"),
      e = {};
    a.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "waterPay" == t.id && (e = t)
      }))
    })), wx.setNavigationBarTitle({
      title: n.t(e.id, {
        value: "en-US" != this.data.$_locale ? e.title : e.entitle
      })
    });
    var o = JSON.parse(t.data);
    wx.$isEmpty(o) ? wx.showModal({
      title: "错误",
      content: "获取信息失败",
      showCancel: !1
    }) : (this.setData({
      roomid: t.roomid,
      roomname: o.roomName,
      areaid: 2,
      buildid: o.roomId,
      elcsysid: o.elcsysid,
      restElecDegree: o.restElecDegree
    }), this.getCanUseBank())
  },
  changePayKind: function(t) {
    this.setData({
      index: t.detail.value
    })
  },
  getCanUseBank: function() {
    var t = this;
    a.$requestSync("POST", "/miniprogram/getbanks", {}, (function(a, e) {
      if (0 == e.retcode) {
        var n = e.data.data ? e.data.data : [],
          o = t.data.array;
        n.length && n.forEach((function(a) {
          a.payflag && (o.push(a), "wxPay" == a.bankcode && t.setData({
            index: t.data.array.length - 1
          }))
        })), t.setData({
          array: o
        })
      }
    }))
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
  doNext: e.throttle((function(t) {
    var e = this,
      n = this.data;
    if (!a.$isDot(n.amount)) return wx.showModal({
      title: "错误",
      content: "金额不能含有小数点",
      showCancel: !1
    }), !1;
    var o = {
      elcsysid: n.elcsysid,
      areaid: n.areaid,
      roomid: n.roomid,
      buildid: n.buildid,
      roomname: n.roomname,
      amount: 100 * n.amount
    };
    a.$requestSync("POST", "/miniprogram/buyelectrityinit", o, (function(t, a) {
      0 == a.retcode && (e.setData({
        billno: a.data.billno
      }), 0 == n.index ? e.rechargeInit() : "wxPay" == n.array[n.index].bankcode && e.wxpay(a.data.billno))
    }))
  }), 5e3),
  close: function() {
    this.setData({
      status: !1
    })
  },
  wxpay: function(t) {
    var e = this.data.amount,
      n = {
        amount: 100 * Number(e),
        paymethod: "",
        billno: t
      };
    a.$requestSync("POST", "/miniprogram/wechatcharge", n, (function(t, e) {
      0 == e.retcode && (wx.showLoading({
        title: "请求中",
        mask: !0
      }), wx.requestPayment({
        timeStamp: e.data.timeStamp,
        nonceStr: e.data.nonceStr,
        package: e.data.packageValue,
        signType: "MD5",
        paySign: e.data.sign,
        success: function(t) {
          wx.hideLoading({
            complete: function(t) {}
          });
          var e = wx.getStorageSync("waterAccountList") ? wx.getStorageSync("waterAccountList") : [];
          if (0 != e.length)
            if (3 == e.length) e.unshift(that.data.roomid), e.pop();
            else {
              e.forEach((function(t) {
                t != that.data.roomid && e.unshift(that.data.roomid)
              }))
            }
          else e.unshift(that.data.roomid);
          wx.setStorageSync("waterAccountList", e), a.$showModal("提示", "缴费成功", "回首页")
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
        areaid: 2,
        roomid: t.data.roomid,
        buildid: 1,
        roomname: t.data.roomname,
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
              var o = n.data.data;
              if (2 == o.billstatus) {
                var i = wx.getStorageSync("waterAccountList") ? wx.getStorageSync("waterAccountList") : [];
                if (0 != i.length)
                  if (3 == i.length) i.unshift(t.data.roomid), i.pop();
                  else {
                    i.forEach((function(a) {
                      a != t.data.roomid && i.unshift(t.data.roomid)
                    }))
                  }
                else i.unshift(t.data.roomid);
                wx.setStorageSync("waterAccountList", i), a.$showModal("提示", "缴费成功", "回首页")
              } else 2 != o.billstatus && 1 != o.billstatus ? a.$showModal("提示", "缴费失败", "回首页") : 1 == n.data.retcode && t.confirm()
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
              var o = n.data.data;
              2 == o.billstatus ? (clearInterval(that.data.setInter), that.setData({
                setInter: null
              }), wx.hideLoading({
                complete: function(t) {}
              }), a.$showModal("提示", "缴费成功", "回首页")) : 2 != o.billstatus && 1 != o.billstatus && (clearInterval(that.data.setInter), that.setData({
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