require("../../@babel/runtime/helpers/Arrayincludes");
(e = require("../../utils/structure")) && e.__esModule;
var e, a = require("../../utils/layout"),
  t = require("@miniprogram-i18n/core");
var n = require("../../utils/request"),
  o = (0, t.getI18nInstance)(),
  i = getApp();
(0, t.I18nPage)({
  data: {
    accountinfo: {},
    header: {},
    balancePart: [],
    funcPart: [],
    progressVal: 90,
    hideProgress: !0,
    showRechargeBtn: !1,
    showSkeleton: !1,
    language: i.globalData.language,
    type: i.globalData.type || wx.getStorageSync("ssltype"),
    subList: [],
    appid: "",
    isShowAnnualReport: !1
  },
  toUrl: function(e) {
    console.log(e);
    var a = e.target.dataset.path;
    this.data.hideProgress || (this.data.accountinfo.expirestatus ? wx.showModal({
      title: o.t("prompt"),
      content: o.t("status_err"),
      showCancel: !1
    }) : wx.navigateTo({
      url: a
    }))
  },
  getAccountinfo: function() {
    var e = this;
    n.$requestSync("POST", "/miniprogram/accountinfo", {}, (function(a, t) {
      if (a)
        if (0 == t.retcode) {
          var n = t.data;
          n.balance = (n.balance / 100).toFixed(2), n.subsidybal = null != n.subsidybal && (n.subsidybal / 100).toFixed(2);
          var o = new Date(n.expiredate.substr(0, 4) + "-" + n.expiredate.substr(4, 2) + "-" + n.expiredate.substr(6, 2)).getTime() + 864e5,
            s = (new Date).getTime();
          n.expirestatus = s > o, i.globalData.userInfo = n, e.setData({
            accountinfo: n,
            progressVal: 100
          }), wx.setStorageSync("user", {
            name: n.username,
            stuempno: n.stuempno,
            sex: n.sex,
            balance: n.balance,
            mobile: n.mobile,
            feetype: n.feetype,
            custtypename: n.custtypename
          }), wx.setStorageSync("privateKey", n.privateKey);
          var r = wx.getAccountInfoSync().miniProgram.appId;
          "erGongYe" != wx.getStorageSync("ssltype") && "wx85b65aa5d71c3aee" != r || e.getFundList(n.stuempno)
        } else e.setData({
          progressVal: 100
        });
      else wx.hideTabBar(), e.setData({
        progressVal: 100
      });
      "wx77c30a197a76fa27" != e.data.appid || wx.getStorageSync("isResetPwd") || wx.reLaunch({
        url: "/pages/changePwd/changePwd"
      })
    }))
  },
  getFundList: function(e) {
    var a = this,
      t = {
        stuempno: e
      };
    n.$requestSync("POST", "/miniprogram/getSpecialFunds", t, (function(e, t) {
      if (0 == t.retcode) {
        var n = t.data.accexlist;
        n.length && n.forEach((function(e) {
          e.balance = (e.availlimit / 100).toFixed(2)
        })), a.setData({
          subList: n
        })
      }
    }))
  },
  scan: function() {
    var e = this;
    wx.scanCode({
      success: function(a) {
        var t = {
          qrcode: a.result
        };
        n.$requestSync("POST", "/miniprogram/checkqrcode", t, (function(a, t) {
          if (0 == t.retcode) {
            var n = t.data.codetype;
            if ("navigate" == n) {
              var i = {
                url: t.data.url,
                id: e.data.accountinfo.stuempno
              };
              wx.navigateTo({
                url: "/pages/scanResult/scanResult?data=" + encodeURIComponent(JSON.stringify(i))
              })
            } else if ("consume" == n) {
              var s = JSON.stringify(t.data.param);
              wx.navigateTo({
                url: "/pages/scanPay/scanPay?data=" + s
              })
            } else "unsupported" == n ? wx.showToast({
              title: o.t("code_err"),
              icon: "none",
              duration: 2e3
            }) : "alert" == n || "c9sw" == n ? setTimeout((function() {
              wx.showToast({
                title: t.data.param.resultInfo,
                icon: "none",
                duration: 2e3
              })
            }), 1e3) : "cgm" == n && wx.navigateTo({
              url: "/pages/venuesCode/venuesCode?q=" + encodeURIComponent(t.data.url)
            })
          }
        }))
      },
      fail: function(e) {
        wx.showToast({
          title: o.t("scan_err"),
          icon: "none",
          duration: 2e3
        })
      }
    })
  },
  allFunc: function(e) {
    if (!this.data.hideProgress)
      if (this.data.accountinfo.expirestatus) wx.showModal({
        title: o.t("prompt"),
        content: o.t("status_err"),
        showCancel: !1
      });
      else {
        var a = e.currentTarget.dataset.item,
          t = a.path,
          i = a.id;
        if (["scan", "scanWaterCode"].includes(i)) this.scan();
        else if ("elecQuery" != i && "elecQuerySmis" != i && "elecQueryCqjtu" != i)
          if ("elecQueryYt" != i)
            if ("lifePay" != i)
              if (["touchorder", "attendance"].includes(i)) {
                var s = "person_id=" + this.data.accountinfo.stuempno + "&user_name=" + this.data.accountinfo.username + "&mobile=" + this.data.accountinfo.mobile;
                this.toWebview(s, "touchorder", t)
              } else if (["cgAppointment", "newcapecH5"].includes(i)) {
          var r = "stuempno=" + this.data.accountinfo.stuempno + "&custname=" + this.data.accountinfo.username + "&mobile=" + this.data.accountinfo.mobile;
          this.toWebview(r, "newcapecH5", t)
        } else if ("schoolpay" != i)
          if ("subscribe" != i)
            if ("onlineCharge" != i)
              if ("waterOrder" != i)
                if (["waterOrderHn", "bindBankCardNkd", "changeJwPwd", "changeDoorPwd"].includes(i)) {
                  var c = "stuempno=" + this.data.accountinfo.stuempno;
                  this.toWebview(c, "schoolorder", t)
                } else "chargeErgy" != i ? "epidemicSign" != i ? "toOtherMiniprogram" != i ? "bindBusCard" != i ? wx.navigateTo({
                  url: t
                }) : this.getactivenfccard() : wx.navigateToMiniProgram({
                  appId: "wxe2844ec5baa7084e",
                  path: "pages/welcome/welcome",
                  envVersion: "develop"
                }) : wx.navigateTo({
                  url: "".concat(t, "?s=").concat(this.data.accountinfo.stuempno, "&n=").concat(this.data.accountinfo.username)
                }) : wx.showModal({
                  title: "温馨提示",
                  content: "1.打开中国银行APP\r\n2.进入“生活缴费”后，定位选择“上海”\r\n3. 点击“校园卡”，选择“上海第二工业大学”\r\n4.输入校园卡卡号及充值金额，点击“下一步”\r\n5.输入短信验证码，确认即可",
                  showCancel: !1
                });
        else wx.showModal({
          title: o.t("prompt"),
          content: o.t("function_err"),
          showCancel: !1
        });
        else this.toWebview("", i, t);
        else {
          var u = this.data.accountinfo.stuempno;
          this.toWebview(u, i, t)
        } else {
          var l = "p=" + this.data.accountinfo.stuempno + "&u=" + this.data.accountinfo.username;
          this.toWebview(l, i, t)
        } else wx.navigateTo({
          url: n.$isEmpty(wx.getStorageSync("isBindWateroom")) ? t : "/pages/lifeCharge/lifeCharge"
        });
        else wx.navigateTo({
          url: n.$isEmpty(wx.getStorageSync("isBindEleroom")) ? t : "/pages/elecharge/yantai"
        });
        else wx.navigateTo({
          url: n.$isEmpty(wx.getStorageSync("isBindEleroom")) ? t : "/pages/elecharge/elecharge"
        })
      }
  },
  getactivenfccard: function() {
    n.$requestSync("POST", "/miniprogram/common/getactivenfccard", {}, (function(e, a) {
      var t = [];
      "0" == a.retcode && (t = a.data ? a.data.data : []), wx.navigateTo({
        url: t.length ? "/pages/unbindBusCard/unbind" : "/pages/unbindBusCard/bind"
      })
    }))
  },
  toWebview: function(e, a, t) {
    var o = this,
      i = {
        encdata: e,
        encodetype: a
      };
    n.$requestSync("POST", "/miniprogram/doencode", i, (function(e, a) {
      if (0 == a.retcode) {
        var n = a.data,
          i = o.data.accountinfo.stuempno;
        wx.navigateTo({
          url: -1 != t.indexOf("?") ? t + "&url=" + n + "&stuempno=" + i : t + "?url=" + n + "&stuempno=" + i
        })
      }
    }))
  },
  isShowAtteFunction: function() {
    var e, a, t = this,
      o = this.data.funcPart,
      s = (null === (e = wx.getStorageSync("user")) || void 0 === e ? void 0 : e.stuempno) || this.data.accountinfo.stuempno || (null === (a = i.globalData.userInfo) || void 0 === a ? void 0 : a.stuempno);
    console.log("考勤学工号：", s), wx.request({
      url: n.baseUrl.substr(0, n.baseUrl.lastIndexOf("/")) + "/attendance/auth/isDisplay",
      method: "GET",
      data: {
        stuempNo: s
      },
      success: function(e) {
        e.data && 0 == e.data.code && (o[1].funcList.push({
          id: "attendance",
          title: "考勤签到",
          iconSrc: "/style/images/index/attendance.png",
          path: "/pages/attendance/attendance",
          isHave: !0
        }), t.setData({
          funcPart: o
        }))
      }
    })
  },
  getLayout: function() {
    var e = this;
    this.setData({
      showSkeleton: !0
    });
    wx.getStorageSync("verno");
    n.$requestSync("POST", "/miniprogram/wxlayout", {}, (function(t, n) {
      if (0 == n.retcode) {
        var s = n.data.layout,
          r = s.verno,
          c = s.headerPart.content,
          u = s.balancePart.content,
          l = s.funcPart.content,
          d = !1;
        l.forEach((function(t, n) {
          t.funcList.forEach((function(t) {
            t.isHave = !0;
            var n = a.functionPart.findIndex((function(e) {
              return e.id === t.id
            })); - 1 != n && (t.iconSrc = a.functionPart[n].iconSrc, t.path = a.functionPart[n].path), "charge" === t.id && e.setData({
              showRechargeBtn: !0
            })
          }))
        })), !l[0].title && (d = !0), wx.setStorageSync("header", c), wx.setStorageSync("balancePart", u), wx.setStorageSync("funcPart", l), wx.setStorageSync("verno", r), wx.setStorageSync("isHaveGap", d), e.setData({
          header: c,
          balancePart: u,
          funcPart: l,
          isHaveGap: d,
          showSkeleton: !1
        }), wx.setNavigationBarTitle({
          title: o.t("school_name", {
            value: "en-US" != i.globalData.language ? e.data.header.schoolName : e.data.header.schoolEnName
          })
        }), e.isShowPopup()
      }
    }))
  },
  annualChange: function(e) {
    this.setData({
      isShowAnnualReport: !1
    }), wx.setStorageSync("isHideAnnualReport", !0), e.detail && wx.navigateTo({
      url: "/pages/h5/epeortal?code=annual"
    })
  },
  isShowPopup: function() {
    var e = this;
    n.$requestSync("POST", "/miniprogram/popUpMessage", {}, (function(a, t) {
      if (0 == t.retcode && a) {
        var n = t.data || [],
          o = n.findIndex((function(e) {
            return "AnnualReport" === e.name
          }));
        if (-1 != o) {
          var i = n[o].content.enable,
            s = !!wx.getStorageSync("isHideAnnualReport");
          if (i) {
            var r = e.data.funcPart;
            r[0].funcList.push({
              id: "annualReport",
              title: "年度账单",
              iconSrc: "/style/images/index/annualReport.png",
              path: "/pages/h5/epeortal?code=annual",
              isHave: !0
            }), e.setData({
              isShowAnnualReport: !s,
              funcPart: r
            })
          }
        }
      }
    }), {
      isShowModal: !1
    })
  },
  toggleLocale: function() {
    this.setLocale("zh-CN" === this.getLocale() ? "en-US" : "zh-CN")
  },
  change_tabbar_lacale: function() {
    wx.setNavigationBarTitle({
      title: o.t("school_name", {
        value: "en-US" != i.globalData.language ? this.data.header.schoolName : this.data.header.schoolEnName
      })
    }), wx.setTabBarItem({
      index: 0,
      text: o.t("index")
    }), wx.setTabBarItem({
      index: 1,
      text: o.t("bills")
    }), wx.setTabBarItem({
      index: 2,
      text: o.t("mine")
    })
  },
  onLoad: function(e) {
    wx.setNavigationBarColor({
      backgroundColor: "#F3F4F6",
      frontColor: "#000000"
    });
    var a = wx.getAccountInfoSync().miniProgram.appId;
    e && e.s && wx.setStorageSync("user", {
      stuempno: e.s
    }), this.setData({
      appid: a
    }), this.change_tabbar_lacale(), this.getLayout()
  },
  onShow: function() {
    wx.setNavigationBarTitle({
      title: o.t("school_name", {
        value: "en-US" != i.globalData.language ? this.data.header.schoolName : this.data.header.schoolEnName
      })
    }), this.setData({
      progressVal: 90,
      hideProgress: !0
    }), this.getAccountinfo()
  },
  hidepro: function() {
    100 == this.data.progressVal && this.setData({
      hideProgress: !1
    })
  },
  onShareAppMessage: function() {
    return {
      title: this.data.header.schoolName,
      path: "/pages/index/index"
    }
  }
});