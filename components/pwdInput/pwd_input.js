var s = require("@miniprogram-i18n/core");
Component({
  behaviors: [s.I18n],
  properties: {
    status: Boolean
  },
  data: {
    isFocus: !1,
    valueList: "",
    ispassword: !0,
    disabled: !0,
    pwd: "",
    cursor: 1,
    gbiao: !0,
    timer: ""
  },
  methods: {
    offPayCode: function() {
      this.triggerEvent("close", {
        off: !1
      }), this.setData({
        valueList: "",
        pwd: "",
        disabled: !0,
        cursor: 1,
        isFocus: !1
      })
    },
    getVal: function(s) {
      console.log(s);
      this.setData({
        cursor: s.detail.cursor + 1
      });
      var t = s.detail.value;
      6 == t.length ? (this.triggerEvent("input", {
        pwd: t
      }), this.setData({
        disabled: !1
      })) : this.setData({
        disabled: !0
      }), this.setData({
        valueList: t
      })
    },
    Tap: function() {
      this.setData({
        isFocus: !0,
        valueList: [],
        pwd: [],
        disabled: !0,
        cursor: 1
      })
    },
    submitPwd: function(s) {
      this.triggerEvent("getValue", {
        pwd: s.detail.value.password,
        off: !1
      }), this.setData({
        valueList: "",
        pwd: "",
        disabled: !0,
        cursor: 1,
        isFocus: !1
      })
    }
  }
});