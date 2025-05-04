var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  o = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    photo: "",
    imgUrl: "",
    width: 240,
    height: 320,
    src: "",
    isShowCropper: !1,
    status: {
      checkflag: 0,
      times: ""
    },
    id: "normal"
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      a = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "getPhoto" == t.id && (a = t)
      }))
    })), wx.setNavigationBarTitle({
      title: o.t(a.id, {
        value: "en-US" != this.data.$_locale ? a.title : a.entitle
      })
    }), this.setData({
      id: t.id ? t.id : "normal"
    }), "Hn" == t.id ? this.getStatus() : "Hs" == t.id && this.getStatusHs(), this.getUserAvatar()
  },
  getUserAvatar: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/getphoto", {}, (function(e, o) {
      var a = wx.getStorageSync("avatar") ? "data:image/png;base64," + wx.getStorageSync("avatar") : "/style/images/getPhoto/postphoto.png";
      if (0 == o.retcode) {
        var s = o.data.photo;
        s && wx.setStorageSync("avatar", s), t.setData({
          photo: s ? "data:image/png;base64," + s : a
        })
      } else t.setData({
        photo: a
      })
    }))
  },
  getStatus: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/getPhotoReject", {}, (function(e, o) {
      if ("0" == o.retcode) {
        var a = o.data;
        a.times = a.time, a.photodata && (a.date = "".concat(a.photodata.substr(0, 4), "-").concat(a.photodata.substr(4, 2), "-").concat(a.photodata.substr(6, 2))), a.phototime && (a.time = "".concat(a.phototime.substr(0, 2), ":").concat(a.phototime.substr(2, 2))), t.setData({
          status: a
        })
      }
    }))
  },
  getStatusHs: function() {
    var t = this;
    e.$requestSync("POST", "/miniprogram/photoStatus", {}, (function(e, o) {
      if ("0" == o.retcode) {
        var a = o.data;
        a.checkflag = "reject" == a.checkStatus ? 2 : 1, a.date = "".concat(a.uploadTime.substr(0, 4), "-").concat(a.uploadTime.substr(4, 2), "-").concat(a.uploadTime.substr(6, 2)), a.remark = a.checkMessage, t.setData({
          status: a
        })
      }
    }))
  },
  loadimage: function(t) {
    console.log("图片加载完成", t.detail), wx.hideLoading(), this.cropper.imgReset()
  },
  clickcut: function(t) {
    console.log(t.detail), wx.previewImage({
      current: t.detail.url,
      urls: [t.detail.url]
    })
  },
  startCropper: function() {
    var t = this,
      e = this;
    e.cropper.getImg((function(o) {
      var a = o.url;
      wx.showToast({
        title: "剪裁成功",
        icon: "none",
        success: function() {
          e.setData({
            photo: a,
            imgUrl: a,
            isShowCropper: !1
          }), t.submitPhoto()
        }
      })
    }))
  },
  getReason: function() {
    wx.showModal({
      title: "驳回理由",
      content: this.data.status.remark,
      showCancel: !1
    })
  },
  getPhoto: function() {
    var t = this;
    wx.chooseMedia({
      sourceType: ["camera", "album"],
      mediaType: ["image"],
      sizeType: ["compressed"],
      camera: "front",
      count: 1,
      success: function(e) {
        var o = e.tempFiles[0].size,
          a = e.tempFiles[0].tempFilePath;
        t.setData({
          size: o,
          isShowCropper: !0,
          src: a
        }), t.cropper = t.selectComponent("#image-cropper")
      },
      fail: function() {
        wx.showToast({
          title: "获取证件照失败",
          icon: "none"
        })
      }
    })
  },
  submitPhoto: function() {
    var t = this.data.status,
      e = t.times,
      o = t.checkflag,
      a = this.data.id;
    if ("once" != e || 1 != o) {
      var s = this.data.imgUrl;
      if (s) {
        var i = s.lastIndexOf("."),
          n = s.substr(i + 1);
        if ("png" == n || "jpg" == n || "jpeg" == n) {
          var c = this.data.size;
          if (console.log(c, 1048576), c > 10485760) wx.showModal({
            title: "温馨提示",
            content: "上传图片大小必须小于10M",
            showCancel: !1
          });
          else {
            wx.showLoading({
              title: "正在上传..."
            });
            var r = this;
            wx.compressImage({
              src: s,
              quality: 50,
              success: function(t) {
                console.log(t);
                var e = t.tempFilePath,
                  o = wx.getFileSystemManager().readFileSync(e, "base64");
                if (console.log(o), r.base64GetSize(o) > 1) wx.showModal({
                  title: "温馨提示",
                  content: "剪裁后图片大小大于1M",
                  showCancel: !1
                });
                else {
                  var s = {
                    photo: o
                  };
                  "Hs" == a ? r.checkPhoto(s) : r.uploadPhoto(s)
                }
              }
            })
          }
        } else wx.showModal({
          title: "温馨提示",
          content: "图片格式必须为png/jpg/jepg",
          showCancel: !1
        })
      } else wx.showModal({
        title: "温馨提示",
        content: "请先点击按钮上面人物图像，拍摄或从相册中选择图片！",
        showCancel: !1
      })
    } else wx.showModal({
      title: "温馨提示",
      content: "您的照片已上传并审核通过,无法再次上传",
      showCancel: !1
    })
  },
  uploadPhoto: function(t) {
    e.$requestSync("POST", "/miniprogram/updatephoto", t, (function(t, o) {
      wx.hideLoading(), 0 == o.retcode && e.$showModal("温馨提示", "上传成功", "返回首页")
    }))
  },
  checkPhoto: function(t) {
    var o = this;
    e.$requestSync("POST", "/ecnu/checkface", t, (function(e, a) {
      wx.hideLoading(), 0 == a.retcode && o.uploadPhotoHs(t)
    }))
  },
  uploadPhotoHs: function(t) {
    e.$requestSync("POST", "/miniprogram/uploadPhoto", {
      imgstr: t.photo
    }, (function(t, o) {
      wx.hideLoading(), 0 == o.retcode && e.$showModal("温馨提示", "上传成功", "返回首页")
    }))
  },
  base64GetSize: function(t) {
    var e = t.length,
      o = (parseInt(e - e / 8 * 2) / 1024 / 1024).toFixed(2);
    return console.log(o), o
  }
});