Page({
  data: {
    src: ""
  },
  onLoad: function(e) {
    var a = e.id,
      t = e.url,
      d = "";
    switch (a) {
      case "bindBankCardNkd":
        d = "https://epay.imust.edu.cn/epay/mini/bankcardbind?code=" + t;
        break;
      case "changeJwPwd":
        d = "https://epay.imust.edu.cn/epay/mini/enterresetpwdjw?code=" + t;
        break;
      case "changeDoorPwd":
        d = "https://epay.imust.edu.cn/epay/mini/enterresetpwdmh?code=" + t
    }
    this.setData({
      src: d
    })
  }
});