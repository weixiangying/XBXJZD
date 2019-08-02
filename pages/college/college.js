// pages/course/course.js
var network = require("../../utils/network.js");
const app = getApp();
var pagesize = 20;
var page = 1;

var hasmore = null;


Page({

  
  data: {
      
      index: 0,
      imgUrls: [],
      showEmpty: false,
      
      
      list: [],
      
      showEmpty: false,
      
  },

  onLoad: function (options) {
      this.empty = this.selectComponent("#empty");
      
      var that = this;
     
   
      
      that.getSwipImgs();
      that.getClassify();
      
  },
    
    
  onShow: function () {
      var that = this;
       pagesize = 20;
       page = 1;
      
       hasmore = null;
       
      that.getList(false);
      
  },
    
    
    getSwipImgs: function () {
        var that = this;
        network.getSwiperImgs(10, function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                that.setData({
                    imgUrls: res.data.data[0].list
                });
                
            }
            
        });

    },
    getList: function (contaFlag) {
        var that = this;
        
        network.POST({
            url: 'v13/ncourse/tan-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "pagesize": pagesize,                
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (contaFlag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });

                    hasmore = res.data.data[0].hasmore;
                } else {

                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });

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
    
    onUnload: function () {
        page = 1;
        hasmore = null;
        this.setData({
            showEmpty: false
        });
    },
    // 点击top，选择课程类型
    mytop: function (e) {
        
        wx.navigateTo({
            url: '/pages/collegeNew/collegeNewClassify/collegeNewClassify' 
        })
    },
    goBack:function(){
        wx.navigateBack({
            delta:1
        })
    },
    getClassify: function () {
        var that = this;
        network.POST({
            url: 'v13/ncourse/category-all',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
            },
            success: function (res) {
                // console.log(res)
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({
                        classifyList: a.list,                        
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
    tz_newcollege:function(e){
        wx.navigateTo({
            url: '/pages/collegeNew/collegeNew?classifyid=' + e.currentTarget.dataset.classifyid + '&mytext=' + e.currentTarget.dataset.mytext,
        })
    },
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/collegeNew/collegeNewDel/collegeNewDel?myid=' + e.currentTarget.dataset.myid
        })
    },
    
})