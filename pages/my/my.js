// pages/my/my.js
const network = require("../../utils/network.js");
const app = getApp();

var uid = '';
var strschool = '';
var strgrade = '';
var schoolid = '';
Page({

  data: {
      list: [],
      currentIndex: 0,
      info:[],
  },

  onLoad: function (options) {
      var that=this;
      

      
  },
    
    choiceName: function (e) {
        uid = e.currentTarget.dataset.uid;
        schoolid = e.currentTarget.dataset.schoolid;
        strschool = e.currentTarget.dataset.strschool;
        strgrade = e.currentTarget.dataset.strgrade;
        var that = this;
        var adata = e.currentTarget.dataset.index;
        that.setData({
            currentIndex: adata,
            listtab: that.data.list[adata]
        })
      // console.log(uid)
        wx.setStorage({
          key: 'choicestu_task',
          data: uid,
        })
        
    },
    getStudentListNew: function () {
        var that = this;
        network.getStudentList(function (res) {
            // console.log(res)
            // console.log(res.data.data[0])
            if (res.data.code == 200) {
                var a = res.data.data[0].list;
                    if (a.length == 0) {
                        that.setData({
                            topempty: true,
                        })
                    }
                    else {
                        that.setData({
                            list: a,
                            listtab: a[0],
                            topempty: false,
                            currentIndex: 0,
                        })
                        uid = that.data.listtab.uid;
                        schoolid = that.data.listtab.school_id;
                        strschool = that.data.listtab.school_name;
                        strgrade = that.data.listtab.grade_name;
                        // console.log(uid)
                    }
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        });
        
    },
    tz_supervise: function () {
        if (uid == '') {
            wx.showToast({
                title: '请添加学生',
                icon: 'none',
                duration: 1000
            })
        }
        else {
            wx.navigateTo({
                url: '/pages/supervise/supervise?uid='+uid,
            })
        }
    },
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function (res) {
            wx.hideLoading();
            // console.log(res)
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                that.setData({
                    info: a,

                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    image: '../../../images/error.png',
                    duration: 1000
                });
            }
        });

    },
  onShow: function () {
      var that=this;
      
      that.getUserInfo();
      that.getStudentListNew();
      
  },
   
    tz_infostudent:function(){
        if (uid == '') {
            wx.showToast({
                title: '请添加学生',
                icon: 'none',
                duration: 1000
            })
        }
        else {
            wx.navigateTo({   
                url: '/pages/my/info_student/info_student?uid='+uid +'&strschool='+strschool+'&strgrade='+strgrade,
            })
        }
    },
    tz_school: function () {
        if (uid == '') {
            wx.showToast({
                title: '请添加学生',
                icon: 'none',
                duration: 1000
            })
        }
        else{
            wx.navigateTo({
                url: '/pages/my/school/school?schoolid= ' + schoolid,
            })
        }
        
    },
    tz_infouser:function(){
        wx.navigateTo({
            url: '/pages/my/info_user/info_user'
        })
    }
})