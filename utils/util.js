var t = function(t) {
  return (t = t.toString())[1] ? t : "0" + t
};
module.exports = {
  formatDateTime: function(e) {
    var n = e.getFullYear(),
      r = e.getMonth() + 1,
      a = e.getDate(),
      o = e.getHours(),
      u = e.getMinutes(),
      i = e.getSeconds();
    return [n, r, a].map(t).join("") + [o, u, i].map(t).join("")
  },
  formatDate: function(e) {
    return [e.getFullYear(), e.getMonth() + 1, e.getDate()].map(t).join("")
  },
  randomString: function(t) {
    t = t || 32;
    var e = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
      n = e.length,
      r = "";
    for (i = 0; i < t; i++) r += e.charAt(Math.floor(Math.random() * n));
    return r
  },
  startFormatDate: function(e) {
    return [e.getFullYear(), e.getMonth() + 1, "01"].map(t).join("")
  },
  endFormatDate: function(e) {
    var n = e.getFullYear(),
      r = e.getMonth() + 1;
    return [n, r, new Date(n, r, 0).getDate()].map(t).join("")
  },
  startFormatDate1: function(e) {
    return [e.substr(0, 4), e.substr(5, 2), "01"].map(t).join("")
  },
  endFormatDate1: function(e) {
    var n = e.substr(0, 4),
      r = e.substr(5, 2);
    return [n, r, new Date(n, r, 0).getDate()].map(t).join("")
  },
  getEnMonth: function(t) {
    return new Date(t).toDateString().split(" ")[1]
  }
};