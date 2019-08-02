// pages/collegeNew/collegeNew.js
var network = require("../../utils/network.js");
const app = getApp();
var page = 1;
var flag = false;
var subId = 0;
var classifyid='';
var rightid = '';
var hasmore = null;
var mytext = '';
Page({

    data: {
        classifyList:[],
        imgUrlsNew: [],
        selectedTab: '',
    },

    onLoad: function (options) {
        var that=this;
        console.log(options)
        mytext = options.mytext;
        console.log(mytext)
        that.setData({
            mytext: options.mytext,
            selectedTab: options.rightid
        })
        // console.log(options.classifyid)
        classifyid = options.classifyid;
        // rightid = options.classifyid;
        // classifyid =160;
        // that.getSwipImgs();
        that.getClassify();
        that.getCourseList(false);
    },
    swiScrollTab: function (e) {
        subId = e.currentTarget.dataset.classify;
        this.setData({
            selectedTab: subId
        });
        // console.log(subId);
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        page = 1;
        this.getCourseList(false);
    },
    
    getClassify: function () {
        var that = this;
        network.POST({
            url: 'v13/ncourse/category',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "pid": classifyid,
            },
            success: function (res) {
                console.log(res)
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    a.list.unshift({
                        PrimaryID: 0,
                        TypeName: '全部'
                    });
                    that.setData({
                        classifyList: a.list,
                        // selectedTab: a.list[0].PrimaryID
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
    
    getSwipImgs: function () {
        var that = this;
        network.getSwiperImgs(10, function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                that.setData({
                    imgUrlsNew: res.data.data[0].list
                });               
            }
        });
    },
    getCourseList: function (flag) {
        var that = this;
        network.POST({
            url: 'v13/ncourse/tan-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "TypeOne": classifyid,
                "TypeTwo": that.data.selectedTab,
                
            },
            success: function (res) {
                wx.hideLoading();
                console.log(res);
                var a = res.data.data[0].list;
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.courselist.concat(a);
                    }
                    that.setData({
                        courselist: a,
                        showCourseEmpty: a.length == 0 ? true : false
                    });
                    
                    // that.setData({
                    //     courselist: a,
                    //     showCourseEmpty: a.length == 0 ? true : false
                    // });
                    hasmore = res.data.data[0].hasmore;
                }
                else {
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
        if (that.data.courselist.length > 0 ) {
            if (hasmore) {
                page++;
                that.getCourseList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    tz_detail:function(e){
        // console.log(e.currentTarget.dataset.myid)
        wx.navigateTo({
            url: '/pages/collegeNew/collegeNewDel/collegeNewDel?myid=' + e.currentTarget.dataset.myid
        })
    }
})