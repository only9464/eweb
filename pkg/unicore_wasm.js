Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.create_context = function(n, e) {
  var r = p(n, t.__wbindgen_malloc, t.__wbindgen_realloc),
    _ = l,
    o = p(e, t.__wbindgen_malloc, t.__wbindgen_realloc),
    u = l;
  return 0 !== t.create_context(r, _, o, u)
}, exports.default = void 0, exports.generate_uniqrcode = function(n, e, r) {
  console.log(n, r);
  try {
    var _ = t.__wbindgen_add_to_stack_pointer(-16),
      o = p(n, t.__wbindgen_malloc, t.__wbindgen_realloc),
      u = l,
      i = p(e, t.__wbindgen_malloc, t.__wbindgen_realloc),
      c = l;
    t.generate_uniqrcode(_, o, u, i, c, r);
    var b = v()[_ / 4 + 0],
      f = v()[_ / 4 + 1],
      w = v()[_ / 4 + 2],
      g = v()[_ / 4 + 3],
      s = b,
      y = f;
    if (g) throw s = 0, y = 0, d(w);
    return a(s, y)
  } finally {
    t.__wbindgen_add_to_stack_pointer(16), t.__wbindgen_free(s, y)
  }
}, exports.greet = function(n) {
  var e = p(n, t.__wbindgen_malloc, t.__wbindgen_realloc),
    r = l;
  t.greet(e, r)
}, exports.initSync = function(n) {
  var e = k();
  var r = new WebAssembly.Module(n);
  return T(new WebAssembly.Instance(r, e), r)
};
var n = require("../@babel/runtime/helpers/regeneratorRuntime"),
  e = require("../@babel/runtime/helpers/typeof"),
  r = require("../@babel/runtime/helpers/asyncToGenerator");
require("../utils/EncoderDecoderTogether.min");
var t, _ = global.TextDecoder,
  o = global.TextEncoder,
  u = new _("utf-8", {
    ignoreBOM: !0,
    fatal: !0
  });
u.decode();
var i = new Uint8Array;

function c() {
  return 0 === i.byteLength && (i = new Uint8Array(t.memory.buffer)), i
}

function a(n, e) {
  return u.decode(c().subarray(n, n + e))
}
var b = new Array(32).fill(void 0);
b.push(void 0, null, !0, !1);
var f = b.length;

function w(n) {
  f === b.length && b.push(b.length + 1);
  var e = f;
  return f = b[e], b[e] = n, e
}

function g(n) {
  return b[n]
}

function d(n) {
  var e = g(n);
  return function(n) {
    n < 36 || (b[n] = f, f = n)
  }(n), e
}
var l = 0,
  s = new o("utf-8"),
  y = "function" == typeof s.encodeInto ? function(n, e) {
    return s.encodeInto(n, e)
  } : function(n, e) {
    var r = s.encode(n);
    return e.set(r), {
      read: n.length,
      written: r.length
    }
  };

function p(n, e, r) {
  if (void 0 === r) {
    var t = s.encode(n),
      _ = e(t.length);
    return c().subarray(_, _ + t.length).set(t), l = t.length, _
  }
  for (var o = n.length, u = e(o), i = c(), a = 0; a < o; a++) {
    var b = n.charCodeAt(a);
    if (b > 127) break;
    i[u + a] = b
  }
  if (a !== o) {
    0 !== a && (n = n.slice(a)), u = r(u, o, o = a + 3 * n.length);
    var f = c().subarray(u + a, u + o);
    a += y(n, f).written
  }
  return l = a, u
}
var h = new Int32Array;

function v() {
  return 0 === h.byteLength && (h = new Int32Array(t.memory.buffer)), h
}

function m(n, e) {
  try {
    return n.apply(this, e)
  } catch (n) {
    t.__wbindgen_exn_store(w(n))
  }
}

function x(n, e) {
  return c().subarray(n / 1, n / 1 + e)
}

function A(n, e) {
  return q.apply(this, arguments)
}

function q() {
  return (q = r(n().mark((function e(r, t) {
    var _;
    return n().wrap((function(n) {
      for (;;) switch (n.prev = n.next) {
        case 0:
          return console.log(r, t), n.next = 3, WXWebAssembly.instantiate(r, t);
        case 3:
          return _ = n.sent, n.abrupt("return", _);
        case 5:
        case "end":
          return n.stop()
      }
    }), e)
  })))).apply(this, arguments)
}

function k() {
  var n, r = {};
  return r.wbg = {}, r.wbg.__wbg_alert_dd83a0ac13bdda71 = function(n, e) {
    console.log(a(n, e))
  }, r.wbg.__wbg_now_b4429909eae1effe = "function" == typeof Date.now ? Date.now : (n = "Date.now", function() {
    throw new Error("".concat(n, " is not defined"))
  }), r.wbg.__wbg_log_86ffe852ec4efe0e = function(n, e) {
    console.log(a(n, e))
  }, r.wbg.__wbindgen_error_new = function(n, e) {
    return w(new Error(a(n, e)))
  }, r.wbg.__wbg_new_693216e109162396 = function() {
    return w(new Error)
  }, r.wbg.__wbg_stack_0ddaca5d1abfb52f = function(n, e) {
    var r = p(g(e).stack, t.__wbindgen_malloc, t.__wbindgen_realloc),
      _ = l;
    v()[n / 4 + 1] = _, v()[n / 4 + 0] = r
  }, r.wbg.__wbg_error_09919627ac0992f5 = function(n, e) {
    try {
      console.error(a(n, e))
    } finally {
      t.__wbindgen_free(n, e)
    }
  }, r.wbg.__wbindgen_object_drop_ref = function(n) {
    d(n)
  }, r.wbg.__wbg_crypto_8fd02d72c4ba6c5c = function(n) {
    return w(g(n).crypto)
  }, r.wbg.__wbindgen_is_object = function(n) {
    var r = g(n);
    return "object" === e(r) && null !== r
  }, r.wbg.__wbg_process_bd02d71a65cf734c = function(n) {
    return w(g(n).process)
  }, r.wbg.__wbg_versions_1d70d407cb23129d = function(n) {
    return w(g(n).versions)
  }, r.wbg.__wbg_node_0091cdf1ffa73e4d = function(n) {
    return w(g(n).node)
  }, r.wbg.__wbindgen_is_string = function(n) {
    return "string" == typeof g(n)
  }, r.wbg.__wbg_msCrypto_7e1e6014bddd75de = function(n) {
    return w(g(n).msCrypto)
  }, r.wbg.__wbg_require_b06abd91965488c8 = function() {
    return m((function() {
      return w(module.require)
    }), arguments)
  }, r.wbg.__wbindgen_is_function = function(n) {
    return "function" == typeof g(n)
  }, r.wbg.__wbindgen_string_new = function(n, e) {
    return w(a(n, e))
  }, r.wbg.__wbg_getRandomValues_f308e7233e5601b7 = function() {
    return m((function(n, e) {
      g(n).getRandomValues(g(e))
    }), arguments)
  }, r.wbg.__wbg_randomFillSync_f20541303a990429 = function() {
    return m((function(n, e, r) {
      g(n).randomFillSync(x(e, r))
    }), arguments)
  }, r.wbg.__wbg_newnoargs_971e9a5abe185139 = function(n, e) {
    return w(new Function(a(n, e)))
  }, r.wbg.__wbg_call_33d7bcddbbfa394a = function() {
    return m((function(n, e) {
      return w(g(n).call(g(e)))
    }), arguments)
  }, r.wbg.__wbindgen_object_clone_ref = function(n) {
    return w(g(n))
  }, r.wbg.__wbg_self_fd00a1ef86d1b2ed = function() {
    return m((function() {
      return w(self.self)
    }), arguments)
  }, r.wbg.__wbg_window_6f6e346d8bbd61d7 = function() {
    return m((function() {
      return w(window.window)
    }), arguments)
  }, r.wbg.__wbg_globalThis_3348936ac49df00a = function() {
    return m((function() {
      return w(globalThis.globalThis)
    }), arguments)
  }, r.wbg.__wbg_global_67175caf56f55ca9 = function() {
    return m((function() {
      return w(global.global)
    }), arguments)
  }, r.wbg.__wbindgen_is_undefined = function(n) {
    return void 0 === g(n)
  }, r.wbg.__wbg_call_65af9f665ab6ade5 = function() {
    return m((function(n, e, r) {
      return w(g(n).call(g(e), g(r)))
    }), arguments)
  }, r.wbg.__wbg_buffer_34f5ec9f8a838ba0 = function(n) {
    return w(g(n).buffer)
  }, r.wbg.__wbg_new_cda198d9dbc6d7ea = function(n) {
    return w(new Uint8Array(g(n)))
  }, r.wbg.__wbg_set_1a930cfcda1a8067 = function(n, e, r) {
    g(n).set(g(e), r >>> 0)
  }, r.wbg.__wbg_length_51f19f73d6d9eff3 = function(n) {
    return g(n).length
  }, r.wbg.__wbg_newwithlength_66e5530e7079ea1b = function(n) {
    return w(new Uint8Array(n >>> 0))
  }, r.wbg.__wbg_subarray_270ff8dd5582c1ac = function(n, e, r) {
    return w(g(n).subarray(e >>> 0, r >>> 0))
  }, r.wbg.__wbindgen_throw = function(n, e) {
    throw new Error(a(n, e))
  }, r.wbg.__wbindgen_memory = function() {
    return w(t.memory)
  }, r
}

function T(n, e) {
  return t = n.exports, E.__wbindgen_wasm_module = e, h = new Int32Array, i = new Uint8Array, t
}

function E(n) {
  return I.apply(this, arguments)
}

function I() {
  return (I = r(n().mark((function e(r) {
    var t, _, o, u;
    return n().wrap((function(n) {
      for (;;) switch (n.prev = n.next) {
        case 0:
          return t = k(), n.t0 = A, n.next = 5, r;
        case 5:
          return n.t1 = n.sent, n.t2 = t, n.next = 9, (0, n.t0)(n.t1, n.t2);
        case 9:
          return _ = n.sent, o = _.instance, u = _.module, n.abrupt("return", T(o, u));
        case 13:
        case "end":
          return n.stop()
      }
    }), e)
  })))).apply(this, arguments)
}
exports.default = E;