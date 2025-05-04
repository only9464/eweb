Component({
  properties: {
    show: {
      type: Boolean,
      value: ""
    }
  },
  pageLifetimes: {
    hide: function() {},
    show: function() {
      var e;
      this.setData({
        username: null === (e = wx.getStorageSync("user")) || void 0 === e ? void 0 : e.name
      })
    },
    resize: function(e) {}
  },
  data: {
    username: ""
  },
  methods: {
    close: function(e) {
      this.triggerEvent("close", {
        show: !1,
        isConfirm: e.currentTarget.dataset.flag
      })
    }
  }
});