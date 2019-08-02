// pages/home/home.js
const network = require("../../utils/network.js");
const app = getApp();
var uid = '';
Page({

  data: {
      base: '../../',
      imgUrls: [],
      courselist: [],
      showCourseEmpty: false,
      imgUrlsNew: [

          { image: '../../images/home/banner_1.png', to_type:'1'},
          { image: '../../images/home/banner_2.png', to_type: '2' },
          { image: '../../images/home/banner_3.png', to_type: '3' }
      ],
  },
    toH5New: function (e) {
        console.log(e.currentTarget.dataset.type)
        var type = e.currentTarget.dataset.type;
        if(type==1){
            wx.navigateTo({
                url: '/pages/spread/spread',              
            })
        }
        if (type == 2) {
            wx.navigateTo({
                url: '/pages/tuiguang/tuiguang',
            })
        }
        if (type == 3) {
            wx.navigateTo({
                url: '/pages/jiameng/jiameng',
            })
        }
    },
  onLoad: function (options) {
      this.empty = this.selectComponent("#empty");
      var that = this;
      that.getSwipImgs();
  },
    getSwipImgs: function () {
        var that = this;
        network.getSwiperImgs(1, function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                that.setData({
                    imgUrls: res.data.data[0].list
                });               
                that.init();
            }
           
        });

    },
    opened: function () {
        wx.navigateTo({
            url: '/pages/emptypage/emptypage',
        })
    },
    tz_supervise: function () {
        if (uid == '') {
            wx.showToast({
                title: '请在“我的”页面中添加学生',
                icon: 'none',
                duration: 1000
            })
        }
        else {
            wx.navigateTo({
                url: '/pages/supervise/supervise?uid=' + uid,
            })
        }
    },
    getStudentListNew: function () {
        var that = this;
        network.getStudentList(function (res) {

            if (res.data.code == 200) {
                var a = res.data.data[0].list;
                if (a.length == 0) {
                    that.setData({
                        list: [],
                        listtab: [],
                        topempty: true,
                        showEmpty: true,
                    })
                    // console.log(that.data.listtab)
                    
                }
                else {

                    that.setData({
                        list: a,
                        listtab: a[0],
                        topempty: false,
                        currentIndex: 0,
                    })

                    uid = that.data.listtab.uid;
                   
                    
                    wx.setStorage({
                        key: 'choicestu_task',
                        data: uid,
                    })
                }
                that.init();
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        });


    },
    tz_little: function () {
        // console.log('111')
        wx.navigateToMiniProgram({
            appId: app.stuAppId,
            path: '/pages/main/pages/home/home?mobile=' + app.userInfo.mobile + '&token=' + app.userInfo.token,
            extraData: {},
            // envVersion: 'develop',
            success(res) {
                // 打开成功
                // console.log(res)
                // console.log('111')
            }
        })

    },
    init() {
        var that = this;

        if (!app.allAddress) {
            network.getAllAdress();
        }
        if (!app.studyOptions) {
            that.getOptions();
        }
        that.getNewsList();
        // that.getCourseList();
    },
    getNewsList: function () {
        var that = this;
        network.getNews(1, function (res) {
            wx.hideLoading();
            var a = res.data.data[0].list;
            if (res.data.code == 200) {
                that.setData({
                    newsList: a,
                    showEmpty: a.length == 0 ? true : false
                });
            }
            
        }, function () {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            });
        });
    },
    getOptions: function () {
        var that = this;
        network.POST({
            url: 'v14/public/conditions',
            params: {},
            success: function (res) {
                // console.log(res);
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    a.kemu.unshift({
                        id: 0,
                        title: '全部'
                    });
                    a.nianji.unshift({
                        id: 0,
                        title: '全部年级'
                    });
                    // console.log(a);
                    app.studyOptions = res.data.data[0];
                    // console.log(app.studyOptions);
                    // that.setData({
                    //     kemu: res.data.data[0].kemu
                    // });

                }

            },
            fail: function () {
                wx.showToast({
                    title: '获取public/conditions失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        }, true);
    },
    onShow:function(){
        var that = this;
        if (app.userInfo) {
            that.empty = that.selectComponent("#empty");
            that.getStudentListNew();
        }
        else {
            wx.navigateTo({
                url: '/pages/login/login',
            })

        }
        wx.getSetting({
            success: (response) => {
                // console.log(response)
                // console.log(response.authSetting['scope.userLocation'])
                if (!response.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: () => {
                            wx.getLocation({
                                type: 'wgs84',
                                success: function (res) {
                                    // console.log(res)
                                    app.longitude = res.longitude;
                                    app.latitude = res.latitude;
                                },
                            })

                        },
                        fail() {
                            
                        }
                    })
                } else {
                    wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                            // console.log(res)
                            app.longitude = res.longitude;
                            app.latitude = res.latitude;
                        },
                    })
                }
            }
        })
    },
    tz_czwt:function(){
        wx.navigateTo({
            url: '/pages/task/growup/growup',
        })
    },
    tz_ryht: function () {
        wx.navigateTo({
            url: '/pages/topic/topic',
        })
    },
    tz_jyzx: function () {
        wx.navigateTo({
            url: '/pages/news/news',
        })
    },
})