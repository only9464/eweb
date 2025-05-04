var e = require("../../utils/request.js");
Page({
  data: {
    ref: {},
    canEvaluateItems: [],
    score: [],
    desc: ["非常差", "差", "一般", "好", "非常好"],
    content: "",
    maxlength: 500,
    nowlength: 0,
    hideName: !1,
    imgList: [],
    maxImgLength: 6
  },
  onLoad: function(e) {
    this.setData({
      ref: JSON.parse(e.data || "{}")
    }), this.getCanEvaluateItems()
  },
  evaluate: function() {
    var t = this,
      a = this.data,
      n = a.score,
      i = a.imgList,
      s = a.ref,
      o = a.content,
      c = a.hideName,
      r = [];
    if ("" != o) {
      i.length && i.forEach((function(e) {
        r.push({
          name: "image" + (new Date).getTime(),
          pic: wx.getFileSystemManager().readFileSync(e.tempFilePath, "base64")
        })
      }));
      var h = {
        stuempno: wx.getStorageSync("user").stuempno,
        refno: s.refno,
        content: o,
        hideName: c.toString(),
        score: JSON.stringify(n),
        picture: r.length ? JSON.stringify(r) : ""
      };
      wx.showLoading({
        title: "请稍候...",
        icon: "none"
      }), e.$requestSync("POST", "/comments/createComment", h, (function(e, a) {
        wx.hideLoading(), "0" == a.retcode && wx.showModal({
          title: "温馨提示",
          content: "评论成功！",
          showCancel: !1,
          success: function(e) {
            e.confirm && wx.redirectTo({
              url: "/pages/evaluate/list?data=" + JSON.stringify(t.data.ref)
            })
          }
        })
      }))
    } else wx.showToast({
      title: "请填写对此商户的评价！！",
      icon: "none",
      duration: 1500
    })
  },
  getCanEvaluateItems: function() {
    var t = this;
    e.$requestSync("POST", "/comments/commentTypes", {}, (function(e, a) {
      if ("0" == a.retcode) {
        var n = a.data,
          i = [];
        n.forEach((function(e) {
          e.enable && i.push({
            commentType: e.commentType,
            score: 3
          })
        })), t.setData({
          canEvaluateItems: n,
          score: i
        })
      }
    }))
  },
  choosePhotos: function() {
    var e = this,
      t = this.data.imgList;
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sizeType: ["compressed"],
      success: function(a) {
        t.push(a.tempFiles[0]), e.setData({
          imgList: t
        })
      },
      fail: function(e) {
        wx.showToast({
          title: e.errMsg || "选取图片失败！",
          icon: "none",
          duration: 1500
        })
      }
    })
  },
  deletePhoto: function(e) {
    var t = e.currentTarget.dataset.index,
      a = this.data.imgList;
    a.splice(t, 1), this.setData({
      imgList: a
    }), console.log(t)
  },
  previewPhoto: function(e) {
    var t = e.currentTarget.dataset.src;
    wx.previewMedia({
      sources: [{
        url: t,
        type: "image"
      }],
      success: function(e) {}
    })
  },
  scoreChange: function(e) {
    var t = e.currentTarget.dataset.index,
      a = this.data.score;
    a[t].score = e.detail, this.setData({
      score: a
    })
  },
  getContent: function(e) {
    var t = e.detail.value;
    this.setData({
      content: t,
      nowlength: t.length > this.data.maxlength ? this.data.maxlength : t.length
    })
  },
  changeHideName: function() {
    this.setData({
      hideName: !this.data.hideName
    })
  }
});