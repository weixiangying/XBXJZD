// pages/course/course.js
const network = require("../../../utils/network.js");
const app = getApp();
var pagesize = 20;
var page = 1;

var hasmore = null;
var search=null;

Page({

  
  data: {
      kemu: [],
      nianji: [],
      index: 0,
      imgUrls: [],
      showEmpty: false,
      
      tabs: [],
      list: [],
      
      showEmpty: false,
      
  },

  onLoad: function (options) {
      this.empty = this.selectComponent("#empty");
      
      var that = this;
     
      search = options.search;

      
      
  },
    
    
  onShow: function () {
      var that = this;
       pagesize = 20;
       page = 1;
       
       hasmore = null;
       
      that.getList(false);
      
  },
    
    
    
    getList: function (contaFlag) {
        var that = this;
        
        network.POST({
            url: 'v13/ncourse/course-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "pagesize": pagesize,
                "teacherid": '',
                "search": search,
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
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/course/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
        })
    },
    onUnload: function () {
        page = 1;
        hasmore = null;
        this.setData({
            showEmpty: false
        });
    },
    
    goBack:function(){
        wx.navigateBack({
            delta:1
        })
    }
})