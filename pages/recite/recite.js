// pages/recite/recite.js
var network = require("../../utils/network.js");
const app = getApp();
var hasmore = '';
var page = 1;
Page({

  data: {
      showEmpty: false,
      list: [],
      gradelist: [],
      versionlist: [],
      gradeid:'',
      versionid: '',
      mask:true,
  },

  onLoad: function (options) {
      var that=this;
      that.empty = that.selectComponent("#empty");
      that.getList(false);
      that.getGrade();
      that.getVersion();
  },

  onShow: function () {

  },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v16/recite/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "gradeid": that.data.gradeid,
                "version": that.data.versionid,
                "page": page,

            },
            success: function (res) {
                //   console.log(res);               
                wx.hideLoading();
                if (res.data.code == 200) {
                    
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    // console.log(that.data.questionList);          
                    hasmore = res.data.data[0].hasmore;
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    getGrade: function (flag) {
        var that = this;
        network.POST({
            url: 'v16/recite/grade-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,                
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {

                    var a = res.data.data[0].list;
                   
                    a.unshift({
                        id: '0',
                        name: '请选择年级'
                    });
                                       
                    that.setData({
                        gradelist: a,   
                        gradeshowname:a[0].name,
                        gradename: a[0].name,                 
                    });
                    // console.log(that.data.gradelist)  
                    
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    getVersion: function (flag) {
        var that = this;
        network.POST({
            url: 'v16/recite/version-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {

                    var a = res.data.data[0].list;
                    that.setData({
                        versionlist: a,
                        versionshowname: a[0].VersionName,
                        versionname: a[0].VersionName    
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    onReachBottom: function () {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    },
    goBack:function(){
        wx.navigateBack({
            
        })
    },
    tz_detail:function(e){
        wx.navigateTo({
            url: '/pages/recite/reciteDetail/reciteDetail?id=' + e.currentTarget.dataset.myid,
        })
    },
    choice_box:function(){
        var that = this;
        that.setData({
            mask: false,
            
        })
    },
    choicegrade:function(e){
        // console.log(e)
        var that=this;
        that.setData({
            gradeid:e.currentTarget.dataset.gradeid,
            gradename: e.currentTarget.dataset.gradename,
        })
        // console.log(that.data.gradeid)
    },
    choiceversion: function (e) {
        // console.log(e)
        var that = this;
        that.setData({
            versionid: e.currentTarget.dataset.versionid,
            versionname: e.currentTarget.dataset.versionname,
        })
        // console.log(that.data.versionid)
    },
    onlyclick: function () {
        
    },
    onlyclickbig:function(){
        // console.log('1111')
        var that=this;
        that.setData({
            mask:true,
            gradeshowname: that.data.gradename,
            versionshowname: that.data.versionname,
        })
        var hasmore = '';
        var page = 1;
        that.getList(false);
    }
})