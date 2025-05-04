var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  s = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    list: [{
      text: s.t("msg_list_text1"),
      isChecked: !1,
      id: "chargepush"
    }, {
      text: s.t("msg_list_text2"),
      isChecked: !1,
      id: "paypush"
    }, {
      text: s.t("msg_list_text3"),
      isChecked: !1,
      id: "balancepush"
    }]
  },
  onLoad: function(t) {
    wx.setNavigationBarTitle({
      title: s.t("msgPush")
    });
    var i = this;
    e.$requestSync("POST", "/miniprogram/querypushconfig", {}, (function(t, e) {
      if (0 == e.retcode) {
        var a = e.data,
          c = i.data.list;
        c[0].isChecked = "1" == a.chargepushflag, c[0].text = s.t("msg_list_text1"), c[1].isChecked = "1" == a.paypushflag, c[1].text = s.t("msg_list_text2"), c[2].isChecked = "1" == a.balancepushflag, c[2].text = s.t("msg_list_text3"), i.setData({
          list: c
        })
      }
    }))
  },
  err: function(t) {
    console.log(t)
  },
  success: function(t) {
    console.log(t)
  },
  switchTab: function(t) {
    var e = t.currentTarget.dataset.index,
      s = this.data.list;
    s[e].isChecked = !s[e].isChecked, this.setData({
      list: s
    })
  },
  onUnload: function() {
    var t = this.data.list,
      s = {
        chargepushflag: t[0].isChecked ? 1 : 0,
        paypushflag: t[1].isChecked ? 1 : 0,
        balancepushflag: t[2].isChecked ? 1 : 0
      };
    e.$requestSync("POST", "/miniprogram/savepushconfig", s, (function(t, e) {
      console.log(e)
    }))
  }
});