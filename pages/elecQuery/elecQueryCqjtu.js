var t = require("@miniprogram-i18n/core"),
  e = require("../../utils/request.js"),
  a = (0, t.getI18nInstance)();
(0, t.I18nPage)({
  data: {
    elesystem: [],
    area: [],
    building: [],
    floor: [],
    room: [],
    district: [],
    systemIndex: 0,
    areaIndex: 0,
    buildingIndex: 0,
    floorIndex: 0,
    roomIndex: 0,
    districtIndex: 0,
    type: "",
    areaid: "1",
    roomid: ""
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      i = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "elecQueryCqjtu" == t.id && (i = t)
      }))
    })), wx.setNavigationBarTitle({
      title: a.t(i.id, {
        value: "en-US" != this.data.$_locale ? i.title : i.entitle
      })
    }), this.setData({
      type: wx.getStorageSync("ssltype")
    }), this.getEleSystem()
  },
  bindSystemChange: function(t) {
    var e = t.detail.value;
    this.setData({
      systemIndex: e
    }), wx.setStorageSync("system_name", this.data.elesystem[e].elcname), "ecnu" == wx.getStorageSync("ssltype") ? this.getDistrict() : this.getElecArea()
  },
  bindAreaChange: function(t) {
    this.setData({
      areaIndex: t.detail.value
    }), this.getDistrict()
  },
  bindDistrictChange: function(t) {
    this.setData({
      districtIndex: t.detail.value
    }), this.getBuilding()
  },
  bindBuildingChange: function(t) {
    this.setData({
      buildingIndex: t.detail.value
    })
  },
  bindFloorChange: function(t) {
    this.setData({
      floorIndex: t.detail.value
    }), this.getRoom()
  },
  bindRoomChange: function(t) {
    this.setData({
      roomIndex: t.detail.value
    })
  },
  getRoomId: function(t) {
    this.setData({
      roomid: t.detail.value
    })
  },
  getEleSystem: function(t) {
    var a = this;
    "ecnu" === a.data.type && wx.showModal({
      title: "温馨提示",
      content: "购电（水）会有数分钟到一小时不等的到账延迟，请关注房间剩余电（水）量，提前购买。",
      showCancel: !1
    }), a.setData({
      elesystem: []
    }), e.$requestSync("POST", "/miniprogram/queryelcsystem", {}, (function(t, e) {
      "0" == e.retcode && (e = e.data, a.setData({
        elesystem: e.data
      }))
    }))
  },
  getElecArea: function() {
    var t = this;
    t.setData({
      area: []
    });
    var a = {
      elcsysid: t.data.elesystem.length > 0 ? t.data.elesystem[t.data.systemIndex].elcsysid : ""
    };
    e.$requestSync("POST", "/miniprogram/queryarea", a, (function(e, a) {
      "0" == a.retcode && (a = a.data, t.setData({
        area: a.data
      }))
    }))
  },
  getDistrict: function() {
    var t = this;
    t.setData({
      district: []
    });
    var a = {
      elcsysid: t.data.elesystem[t.data.systemIndex].elcsysid,
      areaid: "ecnu" == t.data.type ? "1" : t.data.area.length > 0 ? t.data.area[t.data.areaIndex].areaId : ""
    };
    e.$requestSync("POST", "/miniprogram/querydistricts", a, (function(e, a) {
      "0" == a.retcode && (a = a.data, t.setData({
        district: a.data
      }))
    }))
  },
  getBuilding: function() {
    var t = this;
    t.setData({
      building: []
    });
    var a = {
      elcsysid: t.data.elesystem[t.data.systemIndex].elcsysid,
      areaid: "ecnu" == t.data.type ? "1" : t.data.area[t.data.areaIndex].areaId,
      districtid: t.data.district.length > 0 ? t.data.district[t.data.districtIndex].districtId : ""
    };
    e.$requestSync("POST", "/miniprogram/querybuilds", a, (function(e, a) {
      "0" == a.retcode && (a = a.data, t.setData({
        building: a.data
      }))
    }))
  },
  getFloor: function() {
    var t = this;
    t.setData({
      floor: []
    });
    var a = {
      elcsysid: t.data.elesystem[t.data.systemIndex].elcsysid,
      areaid: "ecnu" == t.data.type ? "1" : t.data.area[t.data.areaIndex].areaId,
      districtid: t.data.district[t.data.districtIndex].districtId,
      buildid: t.data.building.length > 0 ? t.data.building[t.data.buildingIndex].buiId : ""
    };
    e.$requestSync("POST", "/miniprogram/queryfloors", a, (function(e, a) {
      "0" == a.retcode && (a = a.data, t.setData({
        floor: a.data
      }))
    }))
  },
  getRoom: function() {
    var t = this;
    t.setData({
      room: []
    });
    var a = {
      elcsysid: t.data.elesystem[t.data.systemIndex].elcsysid,
      areaid: "ecnu" == t.data.type ? "1" : t.data.area[t.data.areaIndex].areaId,
      districtid: t.data.district[t.data.districtIndex].districtId,
      buildid: t.data.building[t.data.buildingIndex].buiId,
      floorid: t.data.floor.length > 0 ? t.data.floor[t.data.floorIndex].floorId : ""
    };
    e.$requestSync("POST", "/miniprogram/queryrooms", a, (function(e, a) {
      "0" == a.retcode && (a = a.data, t.setData({
        room: a.data
      }))
    }))
  },
  doNext: function() {
    var t = this.data,
      a = t.elesystem,
      i = t.area,
      d = t.district,
      s = t.building,
      n = (t.floor, t.roomid),
      r = (t.room, t.systemIndex),
      o = t.areaIndex,
      c = t.districtIndex,
      l = t.buildingIndex;
    t.floorIndex, t.roomIndex;
    if (e.$isEmpty(a) || e.$isEmpty(d) || e.$isEmpty(s) || e.$isEmpty(n)) return wx.showModal({
      title: "错误",
      content: "您的选择不能为空",
      showCancel: !1,
      succuss: function(t) {}
    }), !1;
    var u = a[r].elcsysid,
      y = "ecnu" == this.data.type ? "1" : i[o].areaId,
      g = (d[c].districtId, {
        elcsysid: u,
        areaid: y,
        roomid: n,
        buildid: s[l].buiId
      });
    e.$requestSync("POST", "/miniprogram/queryroominfo", g, (function(t, a) {
      "0" == a.retcode && (e.$isEmpty(wx.getStorageSync("isBindEleroom")) || wx.removeStorageSync("isBindEleroom"), wx.showModal({
        title: "提示",
        content: "是否绑定当前房间",
        cancelText: "否",
        confirmText: "是",
        complete: function(t) {
          t.confirm ? (wx.setStorageSync("isBindEleroom", JSON.stringify(g)), wx.navigateTo({
            url: "/pages/elecharge/elecharge"
          })) : t.cancel && (wx.setStorageSync("roomData", JSON.stringify(a.data)), wx.navigateTo({
            url: "/pages/elecharge/elecharge"
          }))
        }
      }))
    }))
  }
});