! function() {
  var t = {
      CHAR_TILDE: 102
    },
    r = 1,
    i = 2,
    e = 3,
    s = 4,
    h = 5;

  function n(t, r) {
    return void 0 === r ? t >= 32 ? t - 32 : t + 64 : parseInt(String.fromCharCode(t) + String.fromCharCode(r))
  }

  function c(t, h) {
    var n = u(t);
    return n == r || (n == i || (n == e && h == e || n == s && h == s))
  }

  function u(t) {
    return t >= 48 && t <= 57 ? r : t >= 32 && t <= 95 ? i : t < 32 ? e : s
  }
  exports.code128 = function(r, o, l, d) {
    l = parseInt(l), d = parseInt(d);
    for (var p = function(r) {
        var a = {
            currcs: h
          },
          f = function(t) {
            for (var r = [], i = 0; i < t.length; i++) r.push(t.charCodeAt(i));
            return r
          }(r),
          o = 126 == f[0] ? 1 : 0,
          l = f.length > 0 ? u(f[o++]) : i,
          d = f.length > 0 ? u(f[o++]) : i;
        a.currcs = function(t, r) {
          var i = 0;
          return i += t == e ? 1 : 0, i += t == s ? -1 : 0, i += r == e ? 1 : 0, (i += r == s ? -1 : 0) > 0 ? e : s
        }(l, d), a.currcs = function(t, r) {
          for (var i = 0; i < t.length; i++) {
            var e = t[i];
            if ((e < 48 || e > 57) && 126 != e) return r
          }
          return h
        }(f, a.currcs);
        var p = new Array;
        switch (a.currcs) {
          case e:
            p.push(103);
            break;
          case s:
            p.push(104);
            break;
          default:
            p.push(105)
        }
        for (var g = 0; g < f.length; g++) {
          var v = f[g];
          v in t && (p.push(t[v]), g++, v = f[g]);
          var w = f.length > g + 1 ? f[g + 1] : -1;
          p = p.concat(R(v, w, a.currcs)), a.currcs == h && g++
        }
        for (var _ = p[0], b = 1; b < p.length; b++) _ += b * p[b];
        return p.push(_ % 103), p.push(106), p;

        function R(t, r, i) {
          var u = [],
            f = -1;
          if (c(t, i)) i == h && (-1 == r ? (f = 100, i = s) : -1 == r || c(r, i) || (c(r, e) ? (f = 101, i = e) : (f = 100, i = s)));
          else if (-1 == r || c(r, i)) f = 98;
          else switch (i) {
            case e:
              f = 100, i = s;
              break;
            case s:
              f = 101, i = e
          }
          return -1 != f ? (u.push(f), u.push(n(t))) : i == h ? u.push(n(t, r)) : u.push(n(t)), a.currcs = i, u
        }
      }(o), g = new a(r, l, d), v = g.area.width / (11 * (p.length - 3) + 35), w = g.area.left, _ = g.area.top, b = 0; b < p.length; b++)
      for (var R = p[b], C = 0; C < 8; C += 2) {
        var y = f[R][C] * v,
          z = d - _,
          x = f[R][C + 1] * v;
        y > 0 && g.fillFgRect(w, _, y, z), w += y + x
      }
    r.draw()
  };
  var a = function(t, r, i) {
    this.width = r, this.height = i, this.quiet = Math.round(this.width / 40), this.border_size = 0, this.padding_width = 0, this.area = {
      width: r - 2 * this.padding_width - 2 * this.quiet,
      height: i - 2 * this.border_size,
      top: this.border_size - 4,
      left: this.padding_width + this.quiet
    }, this.ctx = t, this.fg = "#000000", this.bg = "#ffffff", this.fillBgRect(0, 0, r, i), this.fillBgRect(0, this.border_size, r, i - 2 * this.border_size)
  };
  a.prototype._fillRect = function(t, r, i, e, s) {
    this.ctx.setFillStyle(s), this.ctx.fillRect(t, r, i, e)
  }, a.prototype.fillFgRect = function(t, r, i, e) {
    this._fillRect(t, r, i, e, this.fg)
  }, a.prototype.fillBgRect = function(t, r, i, e) {
    this._fillRect(t, r, i, e, this.bg)
  };
  var f = [
    [2, 1, 2, 2, 2, 2, 0, 0],
    [2, 2, 2, 1, 2, 2, 0, 0],
    [2, 2, 2, 2, 2, 1, 0, 0],
    [1, 2, 1, 2, 2, 3, 0, 0],
    [1, 2, 1, 3, 2, 2, 0, 0],
    [1, 3, 1, 2, 2, 2, 0, 0],
    [1, 2, 2, 2, 1, 3, 0, 0],
    [1, 2, 2, 3, 1, 2, 0, 0],
    [1, 3, 2, 2, 1, 2, 0, 0],
    [2, 2, 1, 2, 1, 3, 0, 0],
    [2, 2, 1, 3, 1, 2, 0, 0],
    [2, 3, 1, 2, 1, 2, 0, 0],
    [1, 1, 2, 2, 3, 2, 0, 0],
    [1, 2, 2, 1, 3, 2, 0, 0],
    [1, 2, 2, 2, 3, 1, 0, 0],
    [1, 1, 3, 2, 2, 2, 0, 0],
    [1, 2, 3, 1, 2, 2, 0, 0],
    [1, 2, 3, 2, 2, 1, 0, 0],
    [2, 2, 3, 2, 1, 1, 0, 0],
    [2, 2, 1, 1, 3, 2, 0, 0],
    [2, 2, 1, 2, 3, 1, 0, 0],
    [2, 1, 3, 2, 1, 2, 0, 0],
    [2, 2, 3, 1, 1, 2, 0, 0],
    [3, 1, 2, 1, 3, 1, 0, 0],
    [3, 1, 1, 2, 2, 2, 0, 0],
    [3, 2, 1, 1, 2, 2, 0, 0],
    [3, 2, 1, 2, 2, 1, 0, 0],
    [3, 1, 2, 2, 1, 2, 0, 0],
    [3, 2, 2, 1, 1, 2, 0, 0],
    [3, 2, 2, 2, 1, 1, 0, 0],
    [2, 1, 2, 1, 2, 3, 0, 0],
    [2, 1, 2, 3, 2, 1, 0, 0],
    [2, 3, 2, 1, 2, 1, 0, 0],
    [1, 1, 1, 3, 2, 3, 0, 0],
    [1, 3, 1, 1, 2, 3, 0, 0],
    [1, 3, 1, 3, 2, 1, 0, 0],
    [1, 1, 2, 3, 1, 3, 0, 0],
    [1, 3, 2, 1, 1, 3, 0, 0],
    [1, 3, 2, 3, 1, 1, 0, 0],
    [2, 1, 1, 3, 1, 3, 0, 0],
    [2, 3, 1, 1, 1, 3, 0, 0],
    [2, 3, 1, 3, 1, 1, 0, 0],
    [1, 1, 2, 1, 3, 3, 0, 0],
    [1, 1, 2, 3, 3, 1, 0, 0],
    [1, 3, 2, 1, 3, 1, 0, 0],
    [1, 1, 3, 1, 2, 3, 0, 0],
    [1, 1, 3, 3, 2, 1, 0, 0],
    [1, 3, 3, 1, 2, 1, 0, 0],
    [3, 1, 3, 1, 2, 1, 0, 0],
    [2, 1, 1, 3, 3, 1, 0, 0],
    [2, 3, 1, 1, 3, 1, 0, 0],
    [2, 1, 3, 1, 1, 3, 0, 0],
    [2, 1, 3, 3, 1, 1, 0, 0],
    [2, 1, 3, 1, 3, 1, 0, 0],
    [3, 1, 1, 1, 2, 3, 0, 0],
    [3, 1, 1, 3, 2, 1, 0, 0],
    [3, 3, 1, 1, 2, 1, 0, 0],
    [3, 1, 2, 1, 1, 3, 0, 0],
    [3, 1, 2, 3, 1, 1, 0, 0],
    [3, 3, 2, 1, 1, 1, 0, 0],
    [3, 1, 4, 1, 1, 1, 0, 0],
    [2, 2, 1, 4, 1, 1, 0, 0],
    [4, 3, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 2, 2, 4, 0, 0],
    [1, 1, 1, 4, 2, 2, 0, 0],
    [1, 2, 1, 1, 2, 4, 0, 0],
    [1, 2, 1, 4, 2, 1, 0, 0],
    [1, 4, 1, 1, 2, 2, 0, 0],
    [1, 4, 1, 2, 2, 1, 0, 0],
    [1, 1, 2, 2, 1, 4, 0, 0],
    [1, 1, 2, 4, 1, 2, 0, 0],
    [1, 2, 2, 1, 1, 4, 0, 0],
    [1, 2, 2, 4, 1, 1, 0, 0],
    [1, 4, 2, 1, 1, 2, 0, 0],
    [1, 4, 2, 2, 1, 1, 0, 0],
    [2, 4, 1, 2, 1, 1, 0, 0],
    [2, 2, 1, 1, 1, 4, 0, 0],
    [4, 1, 3, 1, 1, 1, 0, 0],
    [2, 4, 1, 1, 1, 2, 0, 0],
    [1, 3, 4, 1, 1, 1, 0, 0],
    [1, 1, 1, 2, 4, 2, 0, 0],
    [1, 2, 1, 1, 4, 2, 0, 0],
    [1, 2, 1, 2, 4, 1, 0, 0],
    [1, 1, 4, 2, 1, 2, 0, 0],
    [1, 2, 4, 1, 1, 2, 0, 0],
    [1, 2, 4, 2, 1, 1, 0, 0],
    [4, 1, 1, 2, 1, 2, 0, 0],
    [4, 2, 1, 1, 1, 2, 0, 0],
    [4, 2, 1, 2, 1, 1, 0, 0],
    [2, 1, 2, 1, 4, 1, 0, 0],
    [2, 1, 4, 1, 2, 1, 0, 0],
    [4, 1, 2, 1, 2, 1, 0, 0],
    [1, 1, 1, 1, 4, 3, 0, 0],
    [1, 1, 1, 3, 4, 1, 0, 0],
    [1, 3, 1, 1, 4, 1, 0, 0],
    [1, 1, 4, 1, 1, 3, 0, 0],
    [1, 1, 4, 3, 1, 1, 0, 0],
    [4, 1, 1, 1, 1, 3, 0, 0],
    [4, 1, 1, 3, 1, 1, 0, 0],
    [1, 1, 3, 1, 4, 1, 0, 0],
    [1, 1, 4, 1, 3, 1, 0, 0],
    [3, 1, 1, 1, 4, 1, 0, 0],
    [4, 1, 1, 1, 3, 1, 0, 0],
    [2, 1, 1, 4, 1, 2, 0, 0],
    [2, 1, 1, 2, 1, 4, 0, 0],
    [2, 1, 1, 2, 3, 2, 0, 0],
    [2, 3, 3, 1, 1, 1, 2, 0]
  ]
}();