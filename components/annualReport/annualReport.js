Component({
  properties: {},
  data: {},
  methods: {
    close: function() {
      this.triggerEvent("change", !1)
    },
    open: function() {
      this.triggerEvent("change", !0)
    }
  }
});