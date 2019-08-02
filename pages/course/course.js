// pages/course/course.js
var network = require("../../utils/network.js");
const app = getApp();
var pagesize = 20;
var page = 1;
var subId = 0;
var hasmore = null;
var nianjiid = '';

Page({

  
  data: {
      kemu: [],
      nianji: [],
      index: 0,
      imgUrls: [],
      showEmpty: false,
      
      tabs: [],
      list: [],
      selectedTab: subId,
      showEmpty: false,
      
  },

  onLoad: function (options) {
      this.empty = this.selectComponent("#empty");
      
      var that = this;
     
   
      that.setData({
          tabs: app.studyOptions.kemu,
          nianji: app.studyOptions.nianji,
      });
    //   console.log(that.data.nianji)
      that.getSwipImgs();
      
  },
    goSearch: function () {
        wx.navigateTo({
            url: '/pages/course/periphery/periphery',
        })
    },
    bindPickerChange(e) {
        var that = this;
        that.setData({
            index: e.detail.value
        })
        for (var i = 0; i < that.data.nianji.length; i++) {
            if (that.data.nianji[that.data.index].title == that.data.nianji[i].title) {

                nianjiid = that.data.nianji[i].id
            }
        }
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getList(false);
    },
  onShow: function () {
      var that = this;
       pagesize = 20;
       page = 1;
       subId = 0;
       hasmore = null;
       nianjiid = '';
      that.getList(false);
      
  },
    swiScrollTab: function (e) {
        subId = e.currentTarget.dataset.index;
        this.setData({
            selectedTab: subId,
            showEmpty: false
        });
        // console.log(subId);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getList(false);
    },
    
    getSwipImgs: function () {
        var that = this;
        network.getSwiperImgs(8, function (res) {
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
            url: 'v13/ncourse/course-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "pagesize": pagesize,
                "teacherid": '',
                "subjectid": subId,
                'gradeid': nianjiid,
                "type": '',
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
    // 点击top，选择课程类型
    mytop: function (e) {
        
        wx.navigateTo({
            url: '/pages/course/courseType/courseType?mytopid=' + e.currentTarget.dataset.mytopid 
        })
    },
    goBack:function(){
        wx.navigateBack({
            delta:1
        })
    }
})