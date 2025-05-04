var n = require("../../utils/request.js");
Page({
  data: {},
  onLoad: function(n) {
    this.query()
  },
  query: function() {
    n.$requestSync("POST", "/miniprogram/fudan/dahuoquery", {}, (function(n, u) {
      console.log(u)
    }))
  },
  pay: function() {
    n.$requestSync("POST", "/miniprogram/fudan/dahuoclear", {}, (function(n, u) {
      console.log(u)
    }))
  }
});