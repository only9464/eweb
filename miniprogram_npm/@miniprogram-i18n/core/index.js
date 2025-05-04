var n = require("../../../@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: !0
});
var e = function() {
  function n() {
    this.subscribers = {}
  }
  return n.prototype.publish = function(n, e) {
    if (n = this.subscribers[n])
      for (var t = 0, r = n.slice(); t < r.length; t++) {
        var i = r[t];
        try {
          i.call(null, e)
        } catch (n) {}
      }
  }, n.prototype.subscribe = function(n, e) {
    "function" == typeof e && (this.subscribers[n] || (this.subscribers[n] = []), this.subscribers[n].push(e))
  }, n.prototype.unsubscribe = function(n, e) {
    var t = this.subscribers[n];
    t && (t.splice(t.indexOf(e), 1), 0 === t.length && delete this.subscribers[n])
  }, n
}();

function t(n, e) {
  return n ? "string" == typeof n ? n : n.reduce((function(n, t) {
    return n.concat([r(t, e)])
  }), []).join("") : ""
}

function r(e, r) {
  if (r = r || {}, "string" == typeof e) return e;
  if (e[2] && "object" == n(e[2])) {
    var i = Object.keys(e[2]).reduce((function(n, i) {
        return n[i] = t(e[2][i], r), n
      }), {}),
      o = i[r[0]],
      a = r[e[0]];
    return void 0 !== a ? i[a.toString()] || i.other || "" : o || i.other || ""
  }
  return "object" == n(e) && 0 < e.length ? function n(e, t, r) {
    return void 0 === r && (r = 0), !t || !e || e.length <= 0 ? "" : "string" == typeof(t = t[e[r]]) ? t : "number" == typeof t ? t.toString() : t ? n(e, t, ++r) : "{" + e.join(".") + "}"
  }(e[0].split("."), r, 0) : ""
}

function i(n, e, t) {
  return (e = n[e]) && (e = e[t]) || t
}(exports.Locale || (exports.Locale = {})).default = "en-US";
var o = new e,
  a = function() {
    function e(n, e, t) {
      if (void 0 === n && (n = {}), void 0 === e && (e = exports.Locale.default), void 0 === t && (t = exports.Locale.default), this.translations = n, this.currentLocale = e, this.fallbackLocale = t, !this.translations) throw new Error("[i18n] translations should be specified before using I18n")
    }
    return e.prototype.lookUpAST = function(n) {
      return function(n, e, t, r) {
        return (t = e[t]) && (t = t[n]) || i(e, r, n)
      }(n, this.translations, this.currentLocale, this.fallbackLocale)
    }, e.prototype.getString = function(n, e) {
      return t(this.lookUpAST(n), e)
    }, e.prototype.setLocale = function(n) {
      this.currentLocale = n, o.publish("localeChange", this.currentLocale)
    }, e.prototype.getLocale = function() {
      return this.currentLocale
    }, e.prototype.loadTranslations = function(e) {
      e && "object" == n(e) && (this.translations = e)
    }, e.prototype.t = function(n, e) {
      return this.getString(n, e)
    }, e.prototype.getFallbackLocale = function() {
      return this.fallbackLocale
    }, e.prototype.onLocaleChange = function(n) {
      return o.subscribe("localeChange", n), {
        off: function() {
          o.unsubscribe("localeChange", n)
        }
      }
    }, e
  }(),
  s = {
    i18nInstance: null
  };
try {
  var c = require("../../../i18n/locales.js");
  c && c.translations && (s.i18nInstance = new a(c.translations, c.defaultLocale, c.fallbackLocale))
} catch (n) {}
var l = Behavior({
  lifetimes: {
    created: function() {
      var n = this;
      this.$_localeChange = function(e) {
        var t;
        n.setData(((t = {}).$_locale = e, t))
      }
    },
    attached: function() {
      var n;
      if (!s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
      this.setData(((n = {}).$_locale = s.i18nInstance.currentLocale, n)), o.subscribe("localeChange", this.$_localeChange)
    },
    detached: function() {
      o.unsubscribe("localeChange", this.$_localeChange)
    }
  },
  methods: {
    t: function(n, e) {
      if (!s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
      return s.i18nInstance.getString(n, e)
    },
    setLocale: function(n) {
      if (!s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
      return s.i18nInstance.setLocale(n)
    },
    getLocale: function() {
      if (!s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
      return s.i18nInstance.getLocale()
    },
    onLocaleChange: function(n) {
      if (!s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
      return s.i18nInstance.onLocaleChange(n)
    }
  }
});
exports.I18nRuntimeBase = a, exports.initI18n = function(n, e) {
  return s.i18nInstance = new a(n.translations, n.defaultLocale, n.fallbackLocale), s.i18nInstance
}, exports.getI18nInstance = function() {
  return s.i18nInstance
}, exports.I18nPage = function(n) {
  if (n = n || {}, !s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
  if (n.data && n.data.hasOwnProperty("$_locale")) throw new Error("[i18n] conflict data field [$_locale] with I18n library");
  if (n.hasOwnProperty("$_localeChange")) throw new Error("[i18n] conflict page method [$_localeChange] with I18n library");
  var e = ((e = {}).$_localeChange = function(n) {
    var e;
    this.setData(((e = {}).$_locale = n, e))
  }, e.onLoad = function() {
    for (var e, t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
    this.setData(((e = {}).$_locale = s.i18nInstance && s.i18nInstance.currentLocale, e)), o.subscribe("localeChange", this.$_localeChange), "function" == typeof n.onLoad && n.onLoad.apply(this, t)
  }, e.onUnload = function() {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    "function" == typeof n.onUnload && n.onUnload.apply(this, e), o.unsubscribe("localeChange", this.$_localeChange)
  }, e.t = function(n, e) {
    if (!s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
    return s.i18nInstance.getString(n, e)
  }, e.getLocale = function() {
    if (!s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
    return s.i18nInstance.getLocale()
  }, e.setLocale = function(n) {
    if (!s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
    s.i18nInstance.setLocale(n)
  }, e.onLocaleChange = function(n) {
    if (!s.i18nInstance) throw new Error("[i18n] ensure run initI18n() in app.js before using I18n library");
    return s.i18nInstance.onLocaleChange(n)
  }, e);
  return Page(Object.assign({}, n, e))
}, exports.I18n = l;