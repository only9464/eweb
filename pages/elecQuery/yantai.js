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
    areaid: "1"
  },
  onLoad: function(t) {
    var e = wx.getStorageSync("funcPart"),
      i = {};
    e.forEach((function(t) {
      t.funcList && t.funcList.forEach((function(t) {
        "elecQueryYt" == t.id && (i = t)
      }))
    })), wx.setNavigationBarTitle({
      title: a.t(i.id, {
        value: "en-US" != this.data.$_locale ? i.title : i.entitle
      })
    }), this.setData({
      type: wx.getStorageSync("ssltype"),
      appid: wx.getAccountInfoSync().miniProgram.appId
    }), this.getEleSystem()
  },
  bindSystemChange: function(t) {
    var e = t.detail.value;
    this.setData({
      systemIndex: e
    }), wx.setStorageSync("system_name", this.data.elesystem[e].elcname), this.getBuilding()
  },
  bindAreaChange: function(t) {
    this.setData({
      areaIndex: t.detail.value
    }), "wx7f3e8c29d4e7099b" != this.data.appid ? this.getDistrict() : this.getBuilding()
  },
  bindDistrictChange: function(t) {
    this.setData({
      districtIndex: t.detail.value
    }), this.getBuilding()
  },
  bindBuildingChange: function(t) {
    this.setData({
      buildingIndex: t.detail.value
    }), this.getRoom()
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
  getEleSystem: function(t) {
    var a = this,
      i = wx.getAccountInfoSync().miniProgram.appId;
    this.setData({
      elesystem: []
    }), e.$requestSync("POST", "/miniprogram/queryelcsystem", {}, (function(t, e) {
      var n = e.data.data || [];
      "wx2de3c86f51410da2" == i && (n = n.filter((function(t) {
        return -1 != t.elcname.indexOf("烟台")
      }))), a.setData({
        elesystem: n
      })
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
      console.log(a), "0" == a.retcode && (a = a.data, t.setData({
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
      console.log(a), "0" == a.retcode && (a = a.data, t.setData({
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
      areaid: 1,
      districtid: 1
    };
    e.$requestSync("POST", "/miniprogram/querybuilds", a, (function(e, a) {
      console.log(a), "0" == a.retcode && (a = a.data, t.setData({
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
      districtid: "wx7f3e8c29d4e7099b" == t.data.appid ? "1" : t.data.district[t.data.districtIndex].districtId,
      buildid: t.data.building.length > 0 ? t.data.building[t.data.buildingIndex].buiId : ""
    };
    e.$requestSync("POST", "/miniprogram/queryfloors", a, (function(e, a) {
      console.log(a), "0" == a.retcode && (a = a.data, t.setData({
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
      areaid: 1,
      districtid: 1,
      buildid: t.data.building[t.data.buildingIndex].buiId,
      floorid: 1
    };
    e.$requestSync("POST", "/miniprogram/queryrooms", a, (function(e, a) {
      console.log(a), "0" == a.retcode && (a = a.data, t.setData({
        room: a.data
      }))
    }))
  },
  doNext: function() {
    var t = this.data,
      a = t.elesystem,
      i = (t.area, t.district, t.building),
      n = (t.floor, t.room),
      s = t.systemIndex,
      d = (t.areaIndex, t.districtIndex, t.buildingIndex),
      r = (t.floorIndex, t.roomIndex);
    if (e.$isEmpty(a) || e.$isEmpty(i) || e.$isEmpty(n)) return wx.showModal({
      title: "错误",
      content: "您的选择不能为空",
      showCancel: !1,
      succuss: function(t) {}
    }), !1;
    var o = a[s].elcsysid,
      c = i[d].buiId,
      l = n[r].roomId,
      u = "".concat(i[d].buiName).concat(n[r].roomName),
      g = {
        elcsysid: o,
        areaid: 1,
        roomid: l,
        buildid: c
      };
    e.$requestSync("POST", "/miniprogram/queryroominfo", g, (function(t, a) {
      "0" == a.retcode && (e.$isEmpty(wx.getStorageSync("isBindEleroom")) || wx.removeStorageSync("isBindEleroom"), wx.showModal({
        title: "提示",
        content: "是否绑定当前房间",
        cancelText: "否",
        confirmText: "是",
        complete: function(t) {
          wx.setStorageSync("remark", u), t.confirm ? (wx.setStorageSync("isBindEleroom", JSON.stringify(g)), wx.navigateTo({
            url: "/pages/elecharge/yantai"
          })) : t.cancel && (wx.setStorageSync("roomData", JSON.stringify(a.data)), wx.navigateTo({
            url: "/pages/elecharge/yantai"
          }))
        }
      }))
    }))
  }
});