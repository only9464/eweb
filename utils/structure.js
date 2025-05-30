var e = require("./request").baseUrl.replace("/openservice", "/cardsurface"),
  i = [{
    title: "常用功能",
    size: "",
    list: [{
      id: "scan",
      title: "扫一扫",
      iconSrc: "/style/images/index/scan.png",
      isHave: !1,
      path: ""
    }, {
      id: "onlineRepair",
      title: "在线报修",
      iconSrc: "/style/images/index/subscribe.png",
      path: "/pages/onlineRepair/onlineRepair",
      isHave: !1
    }, {
      id: "amountTransfer",
      title: "卡余额退款",
      iconSrc: "/style/images/index/cardsTransfer.png",
      path: "/pages/amountTransfer/amountTransfer",
      isHave: !1
    }, {
      id: "scanWaterCode",
      title: "水控码设置",
      iconSrc: "/style/images/index/scan.png",
      isHave: !1,
      path: ""
    }, {
      id: "qrcode",
      title: "支付码",
      iconSrc: "/style/images/index/payCode.png",
      path: "/pages/payCode/payCode?title=支付码&id=0",
      isHave: !1
    }, {
      id: "qrcodeFD",
      title: "校园码",
      iconSrc: "/style/images/index/payCode.png",
      path: "/pages/codefd/codefd",
      isHave: !1
    }, {
      id: "authcode",
      title: "认证码",
      iconSrc: "/style/images/index/authCode.png",
      path: "/pages/payCode/payCode?title=认证码&id=1",
      isHave: !1
    }, {
      id: "touchorder",
      title: "在线点餐",
      iconSrc: "/style/images/index/orderOnline.png",
      path: "/pages/orderOnline/orderOnline",
      isHave: !1
    }, {
      id: "newcapecH5",
      title: "完校",
      iconSrc: "/style/images/index/face.png",
      path: "/pages/orderOnline/newcapech5",
      isHave: !1
    }, {
      id: "CCBEcard",
      title: "建行E码通",
      iconSrc: "/style/images/index/CCB.jpeg",
      path: "/pages/ccbecard/ccbecard",
      isHave: !1
    }, {
      id: "schoolpay",
      title: "校园缴费",
      iconSrc: "/style/images/index/orderOnline.png",
      path: "/pages/schoolPay/schoolPay",
      isHave: !1
    }, {
      id: "subscribe",
      title: "推送设置",
      iconSrc: "/style/images/index/subscribe.png",
      path: "/pages/subscribe/subscribe",
      isHave: !1
    }, {
      id: "charge",
      title: "卡充值",
      iconSrc: "/style/images/index/recharge.png",
      path: "/pages/pay/pay",
      isHave: !1
    }, {
      id: "reportLoss",
      title: "挂失解挂",
      iconSrc: "/style/images/index/reportLoss.png",
      path: "/pages/reportLoss/reportLoss",
      isHave: !1
    }, {
      id: "onlineCharge",
      title: "网上充值",
      iconSrc: "/style/images/index/recharge.png",
      path: "/pages/onlineCharge/onlineCharge",
      isHave: !1
    }, {
      id: "elecQueryHgc",
      title: "电费缴纳",
      iconSrc: "/style/images/index/elecQuery.png",
      path: "/pages/elecQuerySmis/elecHgc",
      isHave: !1
    }, {
      id: "inteFeePay",
      title: "网费缴纳",
      iconSrc: "/style/images/index/inteFeePay.png",
      path: "/pages/inteFeePay/inteFeePay",
      isHave: !1
    }, {
      id: "inteFeePayHgc",
      title: "网费缴纳",
      iconSrc: "/style/images/index/inteFeePay.png",
      path: "/pages/inteFeePay/hgc",
      isHave: !1
    }, {
      id: "outSpecialFound",
      title: "专款账户查询",
      iconSrc: "/style/images/index/outSpecialFound.png",
      path: "/pages/outSpecialFound/outSpecialFound",
      isHave: !1
    }, {
      id: "changePwd",
      title: "密码修改",
      iconSrc: "/style/images/index/changePwd.png",
      path: "/pages/changePwd/changePwd",
      isHave: !1
    }]
  }, {
    title: "卡务中心",
    size: "",
    list: [{
      id: "scan",
      title: "扫一扫",
      iconSrc: "/style/images/index/scan.png",
      isHave: !1,
      path: ""
    }, {
      id: "charge",
      title: "卡充值",
      iconSrc: "/style/images/index/charge.png",
      path: "/pages/pay/pay",
      isHave: !1
    }, {
      id: "chargeErgy",
      title: "卡充值",
      iconSrc: "/style/images/index/charge.png",
      path: "/pages/pay/pay",
      isHave: !1
    }, {
      id: "reportLoss",
      title: "挂失解挂",
      iconSrc: "/style/images/index/reportLoss.png",
      path: "/pages/reportLoss/reportLoss",
      isHave: !1
    }, {
      id: "register",
      title: "拾卡登记",
      iconSrc: "/style/images/index/register.png",
      path: "/pages/register/register",
      isHave: !1
    }, {
      id: "newcapecH5",
      title: "完校",
      iconSrc: "/style/images/index/face.png",
      path: "/pages/orderOnline/newcapech5",
      isHave: !1
    }, {
      id: "apply",
      title: "临时卡申请",
      iconSrc: "/style/images/index/apply.png",
      path: "/pages/apply/apply",
      isHave: !1
    }, {
      id: "getPhoto",
      title: "照片采集",
      iconSrc: "/style/images/index/getPhoto.png",
      path: "/pages/getPhoto/getPhoto",
      isHave: !1
    }, {
      id: "getPhotoHn",
      title: "照片采集",
      iconSrc: "/style/images/index/getPhoto.png",
      path: "/pages/getPhoto/getPhoto?id=Hn",
      isHave: !1
    }, {
      id: "getPhotoHs",
      title: "照片采集",
      iconSrc: "/style/images/index/getPhoto.png",
      path: "/pages/getPhoto/getPhoto?id=Hs",
      isHave: !1
    }, {
      id: "smateCard",
      title: "校友卡",
      iconSrc: "/style/images/index/smateCard.png",
      path: "/pages/smateCard/smateCard",
      isHave: !1
    }, {
      id: "bindBankCard",
      title: "银行卡绑定",
      iconSrc: "/style/images/index/bindBankCard.png",
      path: "/pages/bindBankCard/bindBankCard",
      isHave: !1
    }, {
      id: "bindBankCardNkd",
      title: "银行卡绑定",
      iconSrc: "/style/images/index/bindBankCard.png",
      path: "/pages/nkd/H5?id=bindBankCardNkd",
      isHave: !1
    }, {
      id: "outSpecialFound",
      title: "专款账户查询",
      iconSrc: "/style/images/index/outSpecialFound.png",
      path: "/pages/outSpecialFound/outSpecialFound",
      isHave: !1
    }, {
      id: "cardsTransfer",
      title: "卡间转账",
      iconSrc: "/style/images/index/cardsTransfer.png",
      path: "/pages/cardsTransfer/cardsTransfer",
      isHave: !1
    }, {
      id: "changePwd",
      title: "密码修改",
      iconSrc: "/style/images/index/changePwd.png",
      path: "/pages/changePwd/changePwd",
      isHave: !1
    }, {
      id: "changeDoorPwd",
      title: "门户密码修改",
      iconSrc: "/style/images/index/changePwd.png",
      path: "/pages/nkd/H5?id=changeDoorPwd",
      isHave: !1
    }, {
      id: "changeJwPwd",
      title: "教务密码修改",
      iconSrc: "/style/images/index/changePwd.png",
      path: "/pages/nkd/H5?id=changeJwPwd",
      isHave: !1
    }, {
      id: "changeQuota",
      title: "限额修改",
      iconSrc: "/style/images/index/changeQuota.png",
      path: "/pages/changeQuota/changeQuota",
      isHave: !1
    }, {
      id: "elecQuery",
      title: "电费缴纳",
      iconSrc: "/style/images/index/elecQuery.png",
      path: "/pages/elecQuery/elecQuery",
      isHave: !1
    }, {
      id: "elecQueryCqjtu",
      title: "电费缴纳",
      iconSrc: "/style/images/index/elecQuery.png",
      path: "/pages/elecQuery/elecQueryCqjtu",
      isHave: !1
    }, {
      id: "elecQueryHgc",
      title: "电费缴纳",
      iconSrc: "/style/images/index/elecQuery.png",
      path: "/pages/elecQuerySmis/elecHgc",
      isHave: !1
    }, {
      id: "elecQuerySanda",
      title: "电费缴纳",
      iconSrc: "/style/images/index/elecQuery.png",
      path: "/pages/elecQuerySmis/sanda",
      isHave: !1
    }, {
      id: "elecQuerySmis",
      title: "电费缴纳",
      iconSrc: "/style/images/index/elecQuery.png",
      path: "/pages/elecQuerySmis/elecQuerySmis",
      isHave: !1
    }, {
      id: "inteFeePay",
      title: "网费缴纳",
      iconSrc: "/style/images/index/inteFeePay.png",
      path: "/pages/inteFeePay/inteFeePay",
      isHave: !1
    }, {
      id: "inteFeePayHgc",
      title: "网费缴纳",
      iconSrc: "/style/images/index/inteFeePay.png",
      path: "/pages/inteFeePay/hgc",
      isHave: !1
    }, {
      id: "fixedTel",
      title: "固话缴费",
      iconSrc: "/style/images/index/fixedTel.png",
      path: "/pages/fixedTel/query",
      isHave: !1
    }, {
      id: "touchorder",
      title: "在线点餐",
      iconSrc: "/style/images/index/orderOnline1.png",
      path: "/pages/orderOnline/orderOnline",
      isHave: !1
    }, {
      id: "question",
      title: "常见问题",
      iconSrc: "/style/images/index/cjwt.png",
      path: "/pages/notice/notice?id=question",
      isHave: !1
    }, {
      id: "notice",
      title: "通知公告",
      iconSrc: "/style/images/index/notice.png",
      path: "/pages/notice/notice?id=notice",
      isHave: !1
    }, {
      id: "noticeCard",
      title: "联名卡指南",
      iconSrc: "/style/images/index/meetting.png",
      path: "/pages/notice/notice?id=noticeCard",
      isHave: !1
    }, {
      id: "waterOrder",
      title: "水控预约",
      iconSrc: "/style/images/index/water.png",
      path: "/pages/waterOrder/waterOrder",
      isHave: !1
    }, {
      id: "waterOrderHn",
      title: "水控预约",
      iconSrc: "/style/images/index/water.png",
      path: "/pages/waterOrder/waterOrder",
      isHave: !1
    }, {
      id: "lifePay",
      title: "生活缴费",
      iconSrc: "/style/images/index/water.png",
      path: "/pages/lifePay/lifePay",
      isHave: !1
    }, {
      id: "msgPush",
      title: "推送设置",
      iconSrc: "/style/images/index/subscribe.png",
      path: "/pages/msgPush/msgPush",
      isHave: !1
    }, {
      id: "authcode",
      title: "认证码",
      iconSrc: "/style/images/index/authCode.png",
      path: "/pages/payCode/payCode?title=认证码&id=1",
      isHave: !1
    }, {
      id: "partnershipFee",
      title: "搭伙费清算",
      iconSrc: "/style/images/index/authCode.png",
      path: "/pages/partnershipFee/partnershipFee",
      isHave: !1
    }, {
      id: "bindPhone",
      title: "手机号绑定",
      iconSrc: "/style/images/index/bindPhone.png",
      path: "/pages/bindPhone/bindPhone",
      isHave: !1
    }, {
      id: "amountTransfer",
      title: "卡余额退款",
      iconSrc: "/style/images/index/cardsTransfer.png",
      path: "/pages/amountTransfer/amountTransfer?id=amountTransfer",
      isHave: !1
    }, {
      id: "bathCode",
      title: "洗浴口令",
      iconSrc: "/style/images/index/bathCode.png",
      path: "/pages/bathCode/bathCode",
      isHave: !1
    }, {
      id: "bath",
      title: "浴室查询",
      iconSrc: "/style/images/index/bath.png",
      path: "/pages/bath/area",
      isHave: !1
    }, {
      id: "unbindBusCard",
      title: "联名卡解绑",
      iconSrc: "/style/images/index/unbindBusCard.png",
      path: "/pages/unbindBusCard/unbindBusCard",
      isHave: !1
    }, {
      id: "bindBusCard",
      title: "联名卡绑定",
      iconSrc: "/style/images/index/unbindBusCard.png",
      path: "/pages/unbindBusCard/bind",
      isHave: !1
    }, {
      id: "closeAccount",
      title: "离校退款",
      iconSrc: "/style/images/index/closeAccount.png",
      path: "/pages/amountTransfer/amountTransfer?id=closeAccount",
      isHave: !1
    }, {
      id: "closeAccountHs",
      title: "离校销户",
      iconSrc: "/style/images/index/closeAccount.png",
      path: "/pages/amountTransfer/closeAccount",
      isHave: !1
    }, {
      id: "parkPay",
      title: "停车缴费",
      iconSrc: "/style/images/index/park.png",
      path: "/pages/parkPay/parkPay",
      isHave: !1
    }, {
      id: "waterPay",
      title: "水费缴费",
      iconSrc: "/style/images/index/water.png",
      path: "/pages/waterPay/waterPay",
      isHave: !1
    }, {
      id: "payNotice",
      title: "通用缴费",
      iconSrc: "/style/images/index/payNotice.png",
      path: "/pages/payNotice/list",
      isHave: !1
    }, {
      id: "epidemicSign",
      title: "健康打卡",
      iconSrc: "/style/images/index/epidemicSign.png",
      path: "/pages/jkcode/sign"
    }, {
      id: "onlineRepair",
      title: "在线报修",
      iconSrc: "/style/images/index/subscribe.png",
      path: "/pages/onlineRepair/onlineRepair",
      isHave: !1
    }, {
      id: "cgAppointment",
      title: "场馆预约",
      iconSrc: "/style/images/index/meetting.png",
      path: "/pages/orderOnline/newcapech5?id=cgAppointment",
      isHave: !1
    }, {
      id: "attendance",
      title: "考勤签到",
      iconSrc: "/style/images/index/attendance.png",
      path: "/pages/attendance/attendance",
      isHave: !1
    }, {
      id: "coupon",
      title: "消费券",
      iconSrc: "/style/images/index/coupon.png",
      path: "/pages/coupon/list",
      isHave: !1
    }].concat([{
      id: "custom01",
      title: "功能01",
      iconSrc: e + "/custom01.png",
      path: "/pages/h5/h5?id=custom01&type=touchorder",
      isHave: !1
    }, {
      id: "custom02",
      title: "功能02",
      iconSrc: e + "/custom02.png",
      path: "/pages/h5/h5?id=custom02&type=touchorder",
      isHave: !1
    }, {
      id: "custom03",
      title: "功能03",
      iconSrc: e + "/custom03.png",
      path: "/pages/h5/h5?id=custom03&type=touchorder",
      isHave: !1
    }, {
      id: "custom04",
      title: "功能04",
      iconSrc: e + "/custom04.png",
      path: "/pages/h5/h5?id=custom04&type=touchorder",
      isHave: !1
    }, {
      id: "custom05",
      title: "功能05",
      iconSrc: e + "/custom05.png",
      path: "/pages/h5/h5?id=custom05&type=touchorder",
      isHave: !1
    }, {
      id: "custom06",
      title: "功能06",
      iconSrc: e + "/custom06.png",
      path: "/pages/h5/h5?id=custom06&type=touchorder",
      isHave: !1
    }, {
      id: "custom07",
      title: "功能07",
      iconSrc: e + "/custom07.png",
      path: "/pages/h5/h5?id=custom07&type=touchorder",
      isHave: !1
    }])
  }];
module.exports = {
  list: i
};