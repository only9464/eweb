var t;
Component({
  properties: {
    type: {
      type: String,
      value: ""
    }
  },
  data: {
    text: ""
  },
  pageLifetimes: {
    hide: function() {},
    show: function() {
      this.change()
    },
    resize: function(t) {}
  },
  methods: {
    change: function() {
      this.drawPic(this)
    },
    randomNum: function(t, o) {
      return Math.floor(Math.random() * (o - t) + t)
    },
    randomColor: function(t, o) {
      return "rgb(" + this.randomNum(t, o) + "," + this.randomNum(t, o) + "," + this.randomNum(t, o) + ")"
    },
    drawPic: function(o) {
      (t = wx.createCanvasContext("canvas", o)).fillStyle = this.randomColor(180, 240), t.fillRect(0, 0, 90, 28);
      for (var r = "", a = "ABCEFGHJKLMNPQRSTWXY123456789abcdefghijklmnpqrstvwxy", n = 0; n < 4; n++) {
        var i = a[this.randomNum(0, a.length)];
        t.fillStyle = this.randomColor(50, 160), t.font = this.randomNum(20, 26) + "px SimHei";
        var e = 5 + 20 * n,
          m = this.randomNum(20, 25),
          h = this.randomNum(-20, 20);
        t.translate(e, m), t.rotate(h * Math.PI / 180), t.fillText(i, 5, 0), r += i, t.rotate(-h * Math.PI / 180), t.translate(-e, -m)
      }
      for (n = 0; n < 4; n++) t.strokeStyle = this.randomColor(40, 180), t.beginPath(), t.moveTo(this.randomNum(0, 90), this.randomNum(0, 28)), t.lineTo(this.randomNum(0, 90), this.randomNum(0, 28)), t.stroke();
      for (n = 0; n < 20; n++) t.fillStyle = this.randomColor(0, 255), t.beginPath(), t.arc(this.randomNum(0, 90), this.randomNum(0, 28), 1, 0, 2 * Math.PI), t.fill();
      t.draw(!1, (function() {
        o.triggerEvent("change", r), o.setData({
          text: r
        })
      }))
    }
  }
});