var t = require("../../utils/request.js");
Page({
  data: {
    list: []
  },
  onLoad: function() {
    this.getList()
  },
  getList: function() {
    var i = this,
      e = wx.getStorageSync("showerList") ? wx.getStorageSync("showerList") : [];
    t.$requestSync("POST", "/miniprogram/getShowerList", {}, (function(t, a) {
      if (0 == a.retcode) {
        var n = a.data || [],
          o = [];
        n.forEach((function(t) {
          t.isShowDtl = !1;
          var i = e.findIndex((function(i) {
            return i.id === t.id
          }));
          console.log(i), -1 === i && o.push(t)
        })), i.setData({
          list: e.concat(o)
        })
      }
    }))
  },
  query: function(t) {
    var i = this.data.list,
      e = t.currentTarget.dataset.item,
      a = i.findIndex((function(t) {
        return t.id === e.id
      }));
    this.getDetail(e.id, a)
  },
  getDetail: function(i, e) {
    var a = this,
      n = {
        id: i
      };
    t.$requestSync("POST", "/miniprogram/getShowerInfo", n, (function(t, i) {
      if (0 == i.retcode) {
        wx.showToast({
          title: "查询成功",
          icon: "none"
        });
        var n = i.data,
          o = a.data.list;
        o[e].isShowDtl = !0, n.percent = (i.data.inuse / i.data.total * 100).toFixed(2), o[e].dtl = n, a.setData({
          list: o
        })
      }
    }))
  }
});