Object.defineProperty(exports, "__esModule", {
  value: !0
}), exports.encrypted = exports.decrypted = void 0;
var e, r = (e = require("sm4js")) && e.__esModule ? e : {
  default: e
};
var t = {
  key: "IhaIWKKs9AJpn5ip",
  mode: "ecb",
  cipherType: "base64"
};
exports.encrypted = function(e) {
  return new r.default(t).encrypt(e)
}, exports.decrypted = function(e) {
  return new r.default(t).decrypt(e)
};