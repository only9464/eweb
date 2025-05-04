module.exports = {
  throttle: function(n, t) {
    null != t && null != t || (t = 1500);
    var e = null;
    return function() {
      var u = +new Date;
      u - e > t || !e ? (n.apply(this, arguments), e = u) : wx.showToast({
        title: "请在距上一次点击".concat(t / 1e3, "s后再试！"),
        icon: "none"
      })
    }
  },
  debounce: function(n, t) {
    var e;
    return null != t && null != t || (t = 1500),
      function() {
        var u = arguments,
          l = this;
        clearTimeout(e), e = setTimeout((function() {
          n.apply(l, u)
        }), t)
      }
  }
};