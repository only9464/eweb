Component({
  properties: {
    showModal: {
      type: Boolean,
      value: ""
    },
    type: {
      type: String,
      value: ""
    }
  },
  data: {
    canEnter: !1
  },
  methods: {
    close: function(t) {
      this.triggerEvent("close", {
        show: !1,
        isConfirm: t.currentTarget.dataset.flag
      })
    },
    tel: function(t) {
      var e = t.currentTarget.dataset.tel;
      wx.makePhoneCall({
        phoneNumber: e
      })
    },
    change: function(t) {
      this.setData({
        canEnter: !this.data.canEnter
      }), this.triggerEvent("change", this.data.canEnter)
    }
  }
});