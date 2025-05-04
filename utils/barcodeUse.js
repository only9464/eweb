var e = require("./barcode");

function t(e) {
  return Math.round(wx.getSystemInfoSync().windowWidth * e / 750)
}
module.exports = {
  barcode: function(n, o, r, c) {
    e.code128(wx.createCanvasContext(n), o, t(r), t(c))
  }
};