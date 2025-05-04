var t = require("../../@babel/runtime/helpers/defineProperty");
Component({
  properties: {
    desc: {
      type: Array,
      value: []
    },
    descStyle: {
      type: String,
      value: ""
    },
    stars: {
      type: Array,
      value: [1, 1, 1, 1, 1]
    },
    readOnly: {
      type: Boolean,
      value: !1
    },
    starWidth: {
      type: Number,
      value: 54
    },
    showRating: {
      type: Boolean,
      value: !1
    },
    rating: {
      type: Number,
      value: ""
    }
  },
  data: {},
  lifetimes: {
    attached: function() {
      switch (this.properties.rating) {
        case 1:
          this.properties.stars = [2, 1, 1, 1, 1];
          break;
        case 2:
          this.properties.stars = [2, 2, 1, 1, 1];
          break;
        case 3:
          this.properties.stars = [2, 2, 2, 1, 1];
          break;
        case 4:
          this.properties.stars = [2, 2, 2, 2, 1];
          break;
        case 5:
          this.properties.stars = [2, 2, 2, 2, 2]
      }
      this.setData({
        stars: this.properties.stars
      })
    }
  },
  methods: {
    choseStar: function(e) {
      var a = this,
        r = this.data.stars;
      r.forEach((function(t, e) {
        r[e] = 1, a.setData({
          stars: r
        })
      }));
      for (var s = e.currentTarget.dataset.index, i = 0; i <= s; i++) {
        var n = "stars[" + i + "]";
        this.setData(t({}, n, 2))
      }
      var p = this.data.stars.filter((function(t) {
        return 2 == t
      }));
      this.setData({
        rating: p.length
      }), this.triggerEvent("click", this.data.rating)
    }
  }
});