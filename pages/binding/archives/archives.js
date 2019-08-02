// pages/binding/archives/archives.js
var network = require("../../../utils/network.js");
var md5 = require("../../../utils/md5.js");
const app = getApp();
var addressArray = null;
var provinceId = '';
var cityId = '';
var districtId = '';
var schoolId = '';
var gradeId = '';
var classId = '';

// uid
// :
// 164863      164865
// umobile
// :
// "18822222226"    18822222227

Page({

  data: {
      schoolName: '',
      schoolIndex: '',
      schoolList: [],
      gardeIndex: '',
      gradeList: [],
      classIndex: '',
      classList: [],
      
      showPicker: false,
      address: [],

      name:'',
      sex: 1,

      uid:'',
      umobile: '',
      password:'',
  },
  onLoad: function (options) {
      this.addressPicker = this.selectComponent("#addressPicker");
    //   console.log(app)
    //   console.log(app.allAddress)
      var that=this;
      that.setData({
          uid:options.uid,
          umobile: options.umobile,
          password: options.password,
      })
      
  },
    choicesex:function(e){
        // console.log(e.currentTarget.dataset.sex)
        var that=this;
        that.setData({
            sex: e.currentTarget.dataset.sex
        })
    },
    showPicerFn() {
        this.setData({
            showPicker: true
        });
    },
    getAddressInfo(e) {
        var that = this;
        var res = network.getSelectedAdressInfo(e.detail);
        // console.log(res);
        that.setData({
            address: res
        });

        provinceId = res[0].id;
        cityId = res[1].id;
        districtId = res[2].id;

        that.getSchoolAddrsByAreaId(districtId);
        that.hidePicker();
    },
    hidePicker() {
        this.setData({
            showPicker: false
        });
    },
    getSchoolAddrsByAreaId: function (districtId) {
        var that = this;
        if (!districtId) {
            wx.showToast({
                title: '请选择地区',
                image: '../../../images/error.png',
                duration: 1000
            });
        } else {
            network.POST({
                url: 'v9/address/search-school',
                params: {
                    'district': districtId
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        that.setData({
                            schoolList: res.data.data
                        });
                    } else {

                        wx.showToast({
                            title: res.data.message,
                            image: '../../../images/error.png',
                            duration: 1000
                        });
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    wx.showToast({
                        title: '服务器异常',
                        image: '../../../images/error.png',
                        duration: 1000
                    })
                }
            });
        }
    },
    bindPickerSchool: function (e) {
        var that = this;
        if (!districtId) {
            wx.showToast({
                title: '请选择学校地址',
                image: '../../../images/error.png',
                duration: 1000
            });
        }
        else if (!that.data.schoolList.length) {
            wx.showToast({
                title: '暂无该地区学校',
                image: '../../../images/error.png',
                duration: 1000
            });
        }
        else {
            // console.log(e);
            var a = e.detail.value;
            that.setData({
                schoolIndex: a,
                gardeIndex: '',
                gradeList: [],
                classIndex: '',
                classList: []
            });
            schoolId = that.data.schoolList[a].school_id;
            that.getGradeList(schoolId);
        }
    },
    getGradeList: function (schoolId) {
        var that = this;
        if (!schoolId) {
            wx.showToast({
                title: '请选择学校',
                image: '../../../images/error.png',
                duration: 1000
            });
        } else {
            network.POST({
                url: 'v9/address/grade',
                params: {
                    'schoolid': schoolId
                },
                success: function (res) {
                    wx.hideLoading();
                    // console.log(res);
                    if (res.data.code == 200) {
                        that.setData({
                            gradeList: res.data.data
                        });
                        //   console.log(that.data.gradeList)
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            image: '../../../images/error.png',
                            duration: 1000
                        });
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    wx.showToast({
                        title: '服务器异常',
                        image: '../../../images/error.png',
                        duration: 1000
                    });
                }
            });
        }
    },
    bindPickerGrade: function (e) {
        var that = this;
        if (that.data.gradeList.length == 0) {
            wx.showToast({
                title: '暂无年级可选',
                image: '../../../images/error.png',
                duration: 1000
            });
        } else {
            var a = e.detail.value;
            gradeId = that.data.gradeList[a].id;
            that.setData({
                gradeIndex: a,
                classIndex: '',
                classList: []
            });
            that.getClassList(schoolId, gradeId);
        }
    },
    getClassList: function (schoolId, gradeId) {
        var that = this;
        if (!gradeId) {
            wx.showToast({
                title: '请选择年级',
                image: '../../../images/error.png',
                duration: 1000
            });
        } else {
            network.POST({
                url: 'v9/address/class',
                params: {
                    'schoolid': schoolId,
                    'gradeid': gradeId
                },
                success: function (res) {
                    wx.hideLoading();
                    // console.log(res);
                    if (res.data.code == 200) {
                        that.setData({
                            classList: res.data.data
                        })
                        // console.log(that.data.classList);
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            image: '../../../images/error.png',
                            duration: 1000
                        });
                    }
                },
                fail: function () {
                    wx.hideLoading();
                    wx.showToast({
                        title: '服务器异常',
                        image: '../../../images/error.png',
                        duration: 1000
                    })
                }
            });
        }
    },
    bindPickerClass: function (e) {
        var that = this;
        if (that.data.classList.length == 0) {
            wx.showToast({
                title: '暂无班级可选',
                image: '../../../images/error.png',
                duration: 1000
            });
        } else {
            var a = e.detail.value;
            classId = that.data.classList[a].id;
            that.setData({
                classIndex: a
            });
        }
    },
    
    nameInputEvent: function(e) {
        this.setData({
            name: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    saveSchool: function () {
        // console.log(provinceId)
        // console.log(cityId)
        // console.log(districtId)
        // console.log(schoolId)
        // console.log(gradeId)
        var that = this;
        if (that.valid()) {
            if (app.userInfo) {
                that.getUpArchives();
                
            } else {
                app.toLogin();
            }
        }
    },
    getBindStudent:function(){
        var that=this;
        network.POST({
            url: 'v16/user-bind/save', 
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "user_mobile": that.data.umobile,
                "code": md5.hexMD5(that.data.password),
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    // that.getUpArchives();
                    wx.switchTab({
                        url: '/pages/home/home',
                    })
                   
                } else {
                    wx.showToast({
                        title: res.data.message,
                        image: '../../../images/error.png',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
        });
        
    },
    getUpArchives:function(){
        var that=this;
        network.POST({
            url: 'v16/user-bind/update', //v14/user-school/create
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,

                "u_id": that.data.uid,
                "nickname": that.data.name,
                "sex": that.data.sex,

                "province_id": provinceId,
                "city_id": cityId,
                "district_id": districtId,
                "schoolid": schoolId,
                "gradeid": gradeId,
                "classid": classId

            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.getBindStudent();
                    

                } else {
                    wx.showToast({
                        title: res.data.message,
                        image: '../../../images/error.png',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
        });
    },
    valid: function () {
        var that = this;
        var flag = true;
        var reg = /[\u4e00-\u9fa5a-zA-Z\d]{2,8}/;
        var name=that.data.name;
        if (!name) {

            wx.showToast({
                title: '请输入名字',
                image: '../../../images/error.png',
                duration: 1000
            });
            flag = false;
        }
        else if (!reg.test(name)) {
            wx.showModal({
                title: '提示',
                content: '请输入2-8位的汉字、数字、字母'
            });
            flag = false;
        }

        else if (!schoolId) {
            wx.showToast({
                title: '请选择学校名称',
                image: '../../../images/error.png',
                duration: 1000
            });
            flag = false;
        } else if (!gradeId) {
            wx.showToast({
                title: '请选择年级',
                image: '../../../images/error.png',
                duration: 1000
            });
            flag = false;
        } else if (!classId) {
            wx.showToast({
                title: '请选择班级',
                image: '../../../images/error.png',
                duration: 1000
            });
            flag = false;
        } else { }
        return flag;
    }
})