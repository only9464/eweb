var e = require("@miniprogram-i18n/core"),
  t = require("../../utils/request.js"),
  a = (0, e.getI18nInstance)();
(0, e.I18nPage)({
  data: {
    levels: []
  },
  onLoad: function(e) {
    this.get_all_list(), wx.setNavigationBarTitle({
      title: a.t("lifePay")
    })
  },
  get_all_list: function() {
    var e = this;
    t.$requestSync("POST", "/miniprogram/querylocationlevel", {}, (function(t, a) {
      var l = a.data.levels;
      e.setData({
        levels: l
      }), e.get_location_list()
    }))
  },
  get_location_list: function() {
    var e = this;
    t.$requestSync("POST", "/miniprogram/querylocation", {
      levelnum: 0,
      pid: ""
    }, (function(t, a) {
      var l = a.data.locations,
        i = e.data.levels;
      i[0].list = l, e.setData({
        levels: i
      })
    }))
  },
  bindLevelnumChange_0: function(e) {
    var t = e.detail.value,
      a = this.data.levels;
    a[0].check_num = t + "", this.setData({
      levels: a
    }), this.get_build_list()
  },
  get_build_list: function() {
    var e = this,
      a = {
        levelnum: 1,
        pid: e.data.levels[0].list[e.data.levels[0].check_num].id
      };
    t.$requestSync("POST", "/miniprogram/querylocation", a, (function(t, a) {
      var l = a.data.locations,
        i = e.data.levels;
      i[1].list = l, e.setData({
        levels: i
      })
    }))
  },
  bindLevelnumChange_1: function(e) {
    var t = e.detail.value,
      a = this.data.levels;
    a[1].check_num = t + "", this.setData({
      levels: a
    }), this.get_floor_list()
  },
  get_floor_list: function() {
    var e = this,
      a = {
        levelnum: 2,
        pid: e.data.levels[1].list[e.data.levels[1].check_num].id
      };
    t.$requestSync("POST", "/miniprogram/querylocation", a, (function(t, a) {
      var l = a.data.locations,
        i = e.data.levels;
      i[2].list = l, e.setData({
        levels: i
      })
    }))
  },
  bindLevelnumChange_2: function(e) {
    var t = e.detail.value,
      a = this.data.levels;
    a[2].check_num = t + "", this.setData({
      levels: a
    }), this.get_room_list()
  },
  get_room_list: function() {
    var e = this,
      a = {
        levelnum: 3,
        pid: e.data.levels[2].list[e.data.levels[2].check_num].id
      };
    t.$requestSync("POST", "/miniprogram/querylocation", a, (function(t, a) {
      var l = a.data.locations,
        i = e.data.levels;
      i[3].list = l, e.setData({
        levels: i
      })
    }))
  },
  bindLevelnumChange_3: function(e) {
    var t = e.detail.value,
      a = this.data.levels;
    a[3].check_num = t + "", this.setData({
      levels: a
    })
  },
  query: function() {
    var e = this.data.levels[this.data.levels.length - 1].check_num;
    if (t.$isEmpty(e)) wx.showModal({
      title: "错误",
      content: "您的选择不能为空",
      showCancel: !1,
      succuss: function(e) {}
    });
    else {
      var a = {
        locationid: this.data.levels[this.data.levels.length - 1].list[e].id
      };
      t.$requestSync("POST", "/miniprogram/getlifebills", a, (function(e, l) {
        var i = l.data.billlist;
        console.log(i), t.$isEmpty(wx.getStorageSync("isBindWateroom")) || wx.removeStorageSync("isBindWateroom"), wx.showModal({
          title: "提示",
          content: "是否绑定当前房间",
          cancelText: "否",
          confirmText: "是",
          complete: function(e) {
            e.confirm ? (wx.setStorageSync("isBindWateroom", JSON.stringify(a)), wx.navigateTo({
              url: "/pages/lifeCharge/lifeCharge"
            })) : e.cancel && (wx.setStorageSync("waterData", JSON.stringify(i)), wx.navigateTo({
              url: "/pages/lifeCharge/lifeCharge"
            }))
          }
        })
      }))
    }
  }
});