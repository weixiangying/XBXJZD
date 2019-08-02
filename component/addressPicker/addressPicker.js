const network = require("../../utils/network.js");
const app = getApp();

var provinces = []
var citys = [];
var districts = [];
// var provinceId = '';
// var cityId = '';
// var districtId = '';

Component({
  properties: {},
  data: {
      provinces: provinces,
      citys: citys,
      districts: districts,
      index: [0, 0, 0] //北京市东城区
  },
  attached (){
      var index = this.data.index;
      provinces = app.allAddress;
    //   console.log(app.allAddress);
      citys = provinces[index[0]].city;
      districts = citys[index[1]].district;

      this.setData({
          provinces: provinces,
          citys: citys,
          districts: districts
      });
  },
  methods: {
      bindChange: function (e) {
          var index = e.detail.value;
          citys = provinces[index[0]].city;
          districts = citys[index[1]].district;
          this.setData({
              citys: citys,
              districts: districts,
              index: index
          })
      },
      pikerConfirm() {
          var that = this;
          var index = that.data.index;
          that.triggerEvent('pikerConfirm', index);
      },
      pikerCancel() {
          this.triggerEvent('pikerCancel');
      }
  }
})
