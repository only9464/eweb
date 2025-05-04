var r, t, e = require("../../@babel/runtime/helpers/typeof");
module.exports = (r = {}, t = function(t, n) {
  if (!r[t]) return require(n);
  if (!r[t].status) {
    var i = r[t].m;
    i._exports = i._tempexports;
    var o = Object.getOwnPropertyDescriptor(i, "exports");
    o && o.configurable && Object.defineProperty(i, "exports", {
      set: function(r) {
        "object" === e(r) && r !== i._exports && (i._exports.__proto__ = r.__proto__, Object.keys(r).forEach((function(t) {
          i._exports[t] = r[t]
        }))), i._tempexports = r
      },
      get: function() {
        return i._tempexports
      }
    }), r[t].status = 1, r[t].func(r[t].req, i, i.exports)
  }
  return r[t].m.exports
}, function(t, e, n) {
  r[t] = {
    status: 0,
    func: e,
    req: n,
    m: {
      exports: {},
      _tempexports: {}
    }
  }
}(1735089500704, (function(r, t, n) {
  ! function(i, o) {
    "object" == e(n) && void 0 !== t ? t.exports = o(r("base64-js")) : "function" == typeof define && define.amd ? define(["base64-js"], o) : (i = i || self).Sm4js = o(i.base64js)
  }(this, (function(r) {
    function t(r, t) {
      if (!(r instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function e(r, t) {
      for (var e = 0; e < t.length; e++) {
        var n = t[e];
        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(r, n.key, n)
      }
    }

    function n(r, t, n) {
      return t && e(r.prototype, t), n && e(r, n), r
    }
    r = r && r.hasOwnProperty("default") ? r.default : r;
    var i = function() {
      function e(r) {
        t(this, e)
      }
      return n(e, [{
        key: "zero",
        value: function(r) {
          var t;
          if (0 < r) {
            t = "0";
            for (var e = 1; e < r; e++) t += t;
            return t
          }
          return ""
        }
      }, {
        key: "stringToArray",
        value: function(r) {
          for (var t = [], e = r.length, n = 0; n < e; n++) {
            var i = r.charCodeAt(n);
            if (19968 < i && i < 40869) {
              var o = i.toString(2),
                s = "1110",
                a = "10",
                u = "10",
                y = o.length;
              y <= 6 ? (u = u + this.zero(6 - y) + o, a += this.zero(6), s += this.zero(4)) : 6 < y && y <= 12 ? (u += o.slice(-6), a = a + this.zero(12 - y) + o.substr(0, y - 6), s += this.zero(4)) : (u += o.slice(-6), a += o.substr(y - 12, 6), s = s + this.zero(16 - y) + o.substr(0, y - 12)), t.push(parseInt(s, 2), parseInt(a, 2), parseInt(u, 2))
            } else t.push(i)
          }
          return t
        }
      }, {
        key: "stringToArrayBufferInUtf8",
        value: function(r) {
          return this.stringToArray(r)
        }
      }, {
        key: "utf8ArrayBufferToString",
        value: function(r) {
          for (var t = "", e = r.length, n = 0; n < e;) {
            var i, o = parseInt(r[n]).toString(2);
            if (1 == o.substr(0, 1) && 8 == o.length) {
              var s = parseInt(r[n]).toString(2).substr(4),
                a = parseInt(r[n + 1]).toString(2).substr(2),
                u = parseInt(r[n + 2]).toString(2).substr(2),
                y = parseInt(s + a + u, 2);
              i = String.fromCharCode(y), n += 3
            } else i = String.fromCharCode(parseInt(o, 2)), n++;
            t += i
          }
          return t
        }
      }, {
        key: "arrayBufferToBase64",
        value: function(t) {
          return r.fromByteArray(t)
        }
      }, {
        key: "base64ToArrayBuffer",
        value: function(t) {
          return r.toByteArray(t)
        }
      }]), e
    }();
    Array.prototype.fill || Object.defineProperty(Array.prototype, "fill", {
      value: function(r, t, e) {
        if (null == this) throw new TypeError("this is null or not defined");
        for (var n = Object(this), i = n.length >>> 0, o = t >> 0, s = o < 0 ? Math.max(i + o, 0) : Math.min(o, i), a = void 0 === e ? i : e >> 0, u = a < 0 ? Math.max(i + a, 0) : Math.min(a, i); s < u;) n[s] = r, s++;
        return n
      }
    });
    var o = 16,
      s = new Uint8Array([214, 144, 233, 254, 204, 225, 61, 183, 22, 182, 20, 194, 40, 251, 44, 5, 43, 103, 154, 118, 42, 190, 4, 195, 170, 68, 19, 38, 73, 134, 6, 153, 156, 66, 80, 244, 145, 239, 152, 122, 51, 84, 11, 67, 237, 207, 172, 98, 228, 179, 28, 169, 201, 8, 232, 149, 128, 223, 148, 250, 117, 143, 63, 166, 71, 7, 167, 252, 243, 115, 23, 186, 131, 89, 60, 25, 230, 133, 79, 168, 104, 107, 129, 178, 113, 100, 218, 139, 248, 235, 15, 75, 112, 86, 157, 53, 30, 36, 14, 94, 99, 88, 209, 162, 37, 34, 124, 59, 1, 33, 120, 135, 212, 0, 70, 87, 159, 211, 39, 82, 76, 54, 2, 231, 160, 196, 200, 158, 234, 191, 138, 210, 64, 199, 56, 181, 163, 247, 242, 206, 249, 97, 21, 161, 224, 174, 93, 164, 155, 52, 26, 85, 173, 147, 50, 48, 245, 140, 177, 227, 29, 246, 226, 46, 130, 102, 202, 96, 192, 41, 35, 171, 13, 83, 78, 111, 213, 219, 55, 69, 222, 253, 142, 47, 3, 255, 106, 114, 109, 108, 91, 81, 141, 27, 175, 146, 187, 221, 188, 127, 17, 217, 92, 65, 31, 16, 90, 216, 10, 193, 49, 136, 165, 205, 123, 189, 45, 116, 208, 18, 184, 229, 180, 176, 137, 105, 151, 74, 12, 150, 119, 126, 101, 185, 241, 9, 197, 110, 198, 132, 24, 240, 125, 236, 58, 220, 77, 32, 121, 238, 95, 62, 215, 203, 57, 72]);
    Uint8Array.prototype.fill = function() {
      Array.prototype.fill.apply(this, arguments)
    }, Uint8Array.prototype.slice || (Uint8Array.prototype.slice = function(r) {
      return new Uint8Array(this).subarray(r)
    });
    var a = new Uint32Array([462357, 472066609, 943670861, 1415275113, 1886879365, 2358483617, 2830087869, 3301692121, 3773296373, 4228057617, 404694573, 876298825, 1347903077, 1819507329, 2291111581, 2762715833, 3234320085, 3705924337, 4177462797, 337322537, 808926789, 1280531041, 1752135293, 2223739545, 2695343797, 3166948049, 3638552301, 4110090761, 269950501, 741554753, 1213159005, 1684763257]),
      u = new Uint32Array([2746333894, 1453994832, 1736282519, 2993693404]);
    return function() {
      function r(e) {
        t(this, r), this.Crypt = new i;
        var n = this.Crypt.stringToArrayBufferInUtf8(e.key);
        if (16 !== n.length) throw new Error("key should be a 16 bytes string");
        this.key = n;
        var o = new Uint8Array(0);
        if (void 0 !== e.iv && null !== e.iv && 16 !== (o = this.Crypt.stringToArrayBufferInUtf8(e.iv)).length) throw new Error("iv should be a 16 bytes string");
        this.iv = o, 0 <= [this.mode = "cbc", "ecb"].indexOf(e.mode) && (this.mode = e.mode), 0 <= [this.cipherType = "base64", "text"].indexOf(e.outType) && (this.cipherType = e.outType), this.encryptRoundKeys = new Uint32Array(32), this.spawnEncryptRoundKeys(), Uint32Array.prototype.reverse = function() {
          Array.prototype.reverse.apply(this, arguments)
        }, this.decryptRoundKeys = new Uint32Array(this.encryptRoundKeys), this.decryptRoundKeys.reverse()
      }
      return n(r, [{
        key: "doBlockCrypt",
        value: function(r, t) {
          var e = new Uint32Array(36);
          e.set(r, 0);
          for (var n = 0; n < 32; n++) e[n + 4] = e[n] ^ this.tTransform1(e[n + 1] ^ e[n + 2] ^ e[n + 3] ^ t[n]);
          var i = new Uint32Array(4);
          return i[0] = e[35], i[1] = e[34], i[2] = e[33], i[3] = e[32], i
        }
      }, {
        key: "spawnEncryptRoundKeys",
        value: function() {
          var r = new Uint32Array(4);
          r[0] = this.key[0] << 24 | this.key[1] << 16 | this.key[2] << 8 | this.key[3], r[1] = this.key[4] << 24 | this.key[5] << 16 | this.key[6] << 8 | this.key[7], r[2] = this.key[8] << 24 | this.key[9] << 16 | this.key[10] << 8 | this.key[11], r[3] = this.key[12] << 24 | this.key[13] << 16 | this.key[14] << 8 | this.key[15];
          var t = new Uint32Array(36);
          t[0] = r[0] ^ u[0], t[1] = r[1] ^ u[1], t[2] = r[2] ^ u[2], t[3] = r[3] ^ u[3];
          for (var e = 0; e < 32; e++) t[e + 4] = t[e] ^ this.tTransform2(t[e + 1] ^ t[e + 2] ^ t[e + 3] ^ a[e]), this.encryptRoundKeys[e] = t[e + 4]
        }
      }, {
        key: "rotateLeft",
        value: function(r, t) {
          return r << t | r >>> 32 - t
        }
      }, {
        key: "linearTransform1",
        value: function(r) {
          return r ^ this.rotateLeft(r, 2) ^ this.rotateLeft(r, 10) ^ this.rotateLeft(r, 18) ^ this.rotateLeft(r, 24)
        }
      }, {
        key: "linearTransform2",
        value: function(r) {
          return r ^ this.rotateLeft(r, 13) ^ this.rotateLeft(r, 23)
        }
      }, {
        key: "tauTransform",
        value: function(r) {
          return s[r >>> 24 & 255] << 24 | s[r >>> 16 & 255] << 16 | s[r >>> 8 & 255] << 8 | s[255 & r]
        }
      }, {
        key: "tTransform1",
        value: function(r) {
          var t = this.tauTransform(r);
          return this.linearTransform1(t)
        }
      }, {
        key: "tTransform2",
        value: function(r) {
          var t = this.tauTransform(r);
          return this.linearTransform2(t)
        }
      }, {
        key: "padding",
        value: function(r) {
          if (null === r) return null;
          var t = o - r.length % o,
            e = new Uint8Array(r.length + t);
          return e.set(r, 0), e.fill(t, r.length), e
        }
      }, {
        key: "dePadding",
        value: function(r) {
          if (null === r) return null;
          var t = r[r.length - 1];
          return r.slice(0, r.length - t)
        }
      }, {
        key: "uint8ToUint32Block",
        value: function(r, t) {
          void 0 === t && (t = 0);
          var e = new Uint32Array(4);
          return e[0] = r[t] << 24 | r[t + 1] << 16 | r[t + 2] << 8 | r[t + 3], e[1] = r[t + 4] << 24 | r[t + 5] << 16 | r[t + 6] << 8 | r[t + 7], e[2] = r[t + 8] << 24 | r[t + 9] << 16 | r[t + 10] << 8 | r[t + 11], e[3] = r[t + 12] << 24 | r[t + 13] << 16 | r[t + 14] << 8 | r[t + 15], e
        }
      }, {
        key: "encrypt",
        value: function(r) {
          var t = this.Crypt.stringToArrayBufferInUtf8(r),
            e = this.padding(t),
            n = e.length / o,
            i = new Uint8Array(e.length);
          if ("cbc" === this.mode) {
            if (null === this.iv || 16 !== this.iv.length) throw new Error("iv error");
            for (var s = this.uint8ToUint32Block(this.iv), a = 0; a < n; a++) {
              var u = a * o,
                y = this.uint8ToUint32Block(e, u);
              s[0] = s[0] ^ y[0], s[1] = s[1] ^ y[1], s[2] = s[2] ^ y[2], s[3] = s[3] ^ y[3], s = h = this.doBlockCrypt(s, this.encryptRoundKeys);
              for (var f = 0; f < o; f++) i[u + f] = h[parseInt(f / 4)] >> (3 - f) % 4 * 8 & 255
            }
          } else
            for (a = 0; a < n; a++) {
              u = a * o, y = this.uint8ToUint32Block(e, u);
              var h = this.doBlockCrypt(y, this.encryptRoundKeys);
              for (f = 0; f < o; f++) i[u + f] = h[parseInt(f / 4)] >> (3 - f) % 4 * 8 & 255
            }
          return "base64" === this.cipherType ? this.Crypt.arrayBufferToBase64(i) : this.Crypt.utf8ArrayBufferToString(i)
        }
      }, {
        key: "decrypt",
        value: function(r) {
          var t = new Uint8Array,
            e = (t = "base64" === this.cipherType ? this.Crypt.base64ToArrayBuffer(r) : this.Crypt.stringToArrayBufferInUtf8(r)).length / o,
            n = new Uint8Array(t.length);
          if ("cbc" === this.mode) {
            if (null === this.iv || 16 !== this.iv.length) throw new Error("iv error");
            for (var i = this.uint8ToUint32Block(this.iv), s = 0; s < e; s++) {
              var a = s * o,
                u = this.uint8ToUint32Block(t, a),
                y = this.doBlockCrypt(u, this.decryptRoundKeys);
              (h = new Uint32Array(4))[0] = i[0] ^ y[0], h[1] = i[1] ^ y[1], h[2] = i[2] ^ y[2], h[3] = i[3] ^ y[3], i = u;
              for (var f = 0; f < o; f++) n[a + f] = h[parseInt(f / 4)] >> (3 - f) % 4 * 8 & 255
            }
          } else
            for (s = 0; s < e; s++) {
              a = s * o, u = this.uint8ToUint32Block(t, a);
              var h = this.doBlockCrypt(u, this.decryptRoundKeys);
              for (f = 0; f < o; f++) n[a + f] = h[parseInt(f / 4)] >> (3 - f) % 4 * 8 & 255
            }
          var l = this.dePadding(n);
          return this.Crypt.utf8ArrayBufferToString(l)
        }
      }]), r
    }()
  }))
}), (function(r) {
  return t({} [r], r)
})), t(1735089500704));