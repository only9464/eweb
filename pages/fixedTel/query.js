var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    roomid: "",
    accountList: [],
    systemIndex: 0,
    elesystem: [],
    areaList: [{
      id: 1,
      netname: "哈尔滨",
      areacode: "0451"
    }, {
      id: 2,
      netname: "青岛",
      areacode: "0532"
    }, {
      id: 3,
      netname: "烟台",
      areacode: "0535"
    }]
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      n = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "fixedTel" == t.id && (n = t)
      }))
    })), wx.setNavigationBarTitle({
      title: a.t(n.id, {
        value: "en-US" != this.data.$_locale ? n.title : n.entitle
      })
    }), this.setData({
      accountList: wx.getStorageSync("fixedTelList") ? wx.getStorageSync("fixedTelList") : []
    })
  },
  getRoomid: function(t) {
    this.setData({
      roomid: t.detail.value
    })
  },
  setAccount: function(t) {
    this.setData({
      roomid: t.currentTarget.dataset.account
    })
  },
  bindSystemChange: function(t) {
    console.log(t);
    var e = t.detail.value;
    this.setData({
      systemIndex: e
    })
  },
  getEleSystem: function(t) {
    var a = this;
    e.$requestSync("POST", "/miniprogram/getnetfeesystem", {}, (function(t, e) {
      var n = e.data ? e.data.data : [],
        i = [];
      n.length && n.forEach((function(t) {
        t.netname.indexOf("固话") > 0 && i.push(t)
      })), a.setData({
        elesystem: i
      })
    }))
  },
  doNext: function() {
    var t = this.data,
      a = t.roomid,
      n = t.systemIndex;
    if (e.$isEmpty(a)) return wx.showModal({
      title: "错误",
      content: "固话账号不能为空",
      succuss: function(t) {}
    }), !1;
    var i = this.data.areaList[n].areacode + a,
      o = {
        netid: "5",
        payacc: i
      };
    e.$payRequestSync("POST", "/miniprogram/querynetfeebalance", o, (function(t, e) {
      if (t) {
        var a = e.data;
        if ("0" == a.retcode) {
          var n = a.data.balance.split(","),
            o = {};
          n.forEach((function(t) {
            o[t.split("=")[0].trim()] = t.split("=")[1].trim()
          })), console.log(o), wx.navigateTo({
            url: "/pages/fixedTel/recharge?data=" + JSON.stringify(o) + "&roomid=" + i
          })
        } else wx.showModal({
          title: "温馨提示",
          content: "您输入的号码有误，请重新输入！",
          showCancel: !1
        })
      }
    }))
  }
});