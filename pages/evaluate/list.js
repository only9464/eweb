var t = require("../../utils/request.js");
Page({
  data: {
    height: "",
    desc: ["非常差", "差", "一般", "好", "非常好"],
    descStyle: "color:rgba(0, 0, 0, 0.5);font-weight:normal",
    pageno: 1,
    pagesize: 3,
    totalPage: 1,
    list: [],
    extranet: "true",
    order: "",
    isMyself: !1,
    ref: {},
    orderIndex: 0,
    orderList: [{
      code: "",
      value: "默认排序"
    }, {
      code: "score_asc",
      value: "升序排序"
    }, {
      code: "score_desc",
      value: "降序排序"
    }],
    fliterBtns: [{
      text: "全部",
      isClick: !0
    }, {
      text: "仅自己",
      isClick: !1
    }]
  },
  onLoad: function(t) {
    this.setData({
      ref: JSON.parse(t.data || "{}")
    }), this.getList(), this.getAvgScore()
  },
  onReady: function() {
    var t = this,
      e = wx.createSelectorQuery();
    e.select(".list-con").boundingClientRect(), e.selectViewport().scrollOffset(), e.exec((function(e) {
      t.setData({
        height: "calc( ".concat(wx.getSystemInfoSync().windowHeight - e[0].top, "px - 30rpx)")
      })
    }))
  },
  getAvgScore: function() {
    var e = this,
      a = {
        shopaccno: this.data.ref.shopaccno
      };
    t.$requestSync("POST", "/comments/queryShopAvgScore", a, (function(t, a) {
      if ("0" == a.retcode) {
        var s = a.data.average || [],
          c = s.reduce((function(t, e) {
            return (t.score || 0) + (e.score || 0)
          })),
          o = c ? c / s.length : 5;
        e.setData({
          avgScore: o.toFixed(1)
        })
      }
    }))
  },
  getList: function() {
    var e, a = this,
      s = this.data,
      c = s.pageno,
      o = s.pagesize,
      i = s.order,
      n = s.extranet,
      r = s.ref,
      u = {
        stuempno: s.isMyself ? null === (e = wx.getStorageSync("user")) || void 0 === e ? void 0 : e.stuempno : "",
        shopaccno: r.shopaccno,
        refno: "",
        pageno: c,
        pagesize: o,
        extranet: n,
        order: i
      };
    t.$requestSync("POST", "/comments/queryComments", u, (function(t, e) {
      if ("0" == e.retcode) {
        var s = e.data.list;
        s.length && s.forEach((function(t) {
          t.createtimeFormat = "".concat(t.createtime.substr(0, 4), "-").concat(t.createtime.substr(4, 2), "-").concat(t.createtime.substr(6, 2), " ").concat(t.createtime.substr(8, 2), ":").concat(t.createtime.substr(10, 2)), t.backDateTime && (t.backDateTimeFormat = "".concat(t.backDateTime.substr(0, 4), "-").concat(t.backDateTime.substr(4, 2), "-").concat(t.backDateTime.substr(6, 2), " ").concat(t.backDateTime.substr(8, 2), ":").concat(t.backDateTime.substr(10, 2)))
        })), a.setData({
          totalPage: e.data.totalPage,
          list: a.data.list.concat(s)
        })
      }
    }))
  },
  getMoreList: function() {
    var t = this.data,
      e = t.pageno,
      a = t.totalPage,
      s = t.isMyself;
    e + 1 > a || (this.setData({
      pageno: e + 1
    }), this.getList(s))
  },
  previewPhoto: function(t) {
    var e = t.currentTarget.dataset,
      a = e.current,
      s = e.index,
      c = this.data.list[s].pictures.map((function(t) {
        return {
          url: t.pic
        }
      }));
    wx.previewMedia({
      sources: c,
      current: a,
      success: function(t) {}
    })
  },
  toEvaluate: function() {
    wx.navigateTo({
      url: "/pages/evaluate/evaluate?data=" + JSON.stringify(this.data.ref)
    })
  },
  changeBtns: function(t) {
    var e = t.currentTarget.dataset.index,
      a = this.data.fliterBtns;
    a.forEach((function(t) {
      return t.isClick = !1
    })), a[e].isClick = !0, this.setData({
      fliterBtns: a,
      isMyself: 1 == e,
      pageno: 1,
      totalPage: 1,
      list: []
    }), this.getList()
  },
  pickChange: function(t) {
    var e = +t.detail.value;
    this.setData({
      orderIndex: e,
      order: this.data.orderList[e].code,
      pageno: 1,
      totalPage: 1,
      list: []
    }), this.getList()
  },
  delete: function(e) {
    var a = this;
    console.log(e);
    var s = e.currentTarget.dataset.commentid;
    wx.showModal({
      title: "温馨提示",
      content: "确定要删除此条评论吗？",
      success: function(e) {
        if (e.confirm) {
          var c = {
            commentId: s
          };
          t.$requestSync("POST", "/comments/deleteComment", c, (function(t, e) {
            "0" == e.retcode && wx.showToast({
              title: "删除成功！",
              icon: "none",
              duration: 1500,
              success: function(t) {
                a.setData({
                  pageno: 1,
                  totalPage: 1,
                  list: []
                }), a.getList()
              }
            })
          }))
        }
      }
    })
  }
});