// pages/collegeNew/collegeNewDel/collegeNewDel.js

var network = require("../../../utils/network.js");
const app = getApp();
var myid='';

Page({  
    data: {
        tabstyle:1,
        hidemoney:false
    },
    onLoad: function (options) {
        // console.log(options.myid);
        myid = options.myid;
        // myid = 1047;
        var that=this;
        that.getDetail();
        // that.getList();
        
    },

    onShow: function () {

    },
    click_tab: function (e) {
        var that=this;
        var a =e.currentTarget.dataset.tabstyle;
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        if(a==1){
            that.setData({
                tabstyle: 1
            })
        }
        if (a == 2) {
            that.setData({
                tabstyle: 2
            })
            that.getList();
        }
    },
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v13/ncourse/tan-detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": myid
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        detail: res.data.data[0].item,                        
                    });
                    if (res.data.data[0].item.LessonPrice != 0) {
                        that.getCheck();
                    }
                    else{
                        // console.log('免费')
                        wx.getSystemInfo({
                            success: function (res) {
                                that.setData({
                                    scrollheight: res.windowHeight - res.windowWidth / 750 * 410 - res.windowHeight * 0.1,
                                    hidemoney: false
                                });
                            }
                        });
                    }
                    
                    
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: none,
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
        })
    },
    getCheck: function () {
        var that = this;
        network.POST({
            url: 'v14/renewal/check',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "order_type": 8,
                "order_type_id": myid,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    if(a.is_end==1){
                        //到期需交钱
                        wx.getSystemInfo({
                            success: function (res) {
                                that.setData({
                                    scrollheight: res.windowHeight - res.windowWidth / 750 * 510 - res.windowHeight * 0.1,
                                    hidemoney: true
                                });
                            }
                        });
                    }
                    else{
                        wx.getSystemInfo({
                            success: function (res) {
                                that.setData({
                                    scrollheight: res.windowHeight - res.windowWidth / 750 * 410 - res.windowHeight * 0.1,
                                    hidemoney: false
                                });
                            }
                        });
                    }
                    

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
        //   console.log(that.data.showTalk)
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v13/ncourse/tan-file-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,               
                "lessonid": myid,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;                    
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    for(var i=0;i<that.data.list.length;i++){
                        // this.data.answerlist[i].checked = 1
                        that.data.list[i].myindex = Number(i + 1) < 10 ? ('0' + (i + 1)) : i + 1;
                    }
                    that.setData({
                        list:that.data.list
                    })
                    // console.log(that.data.list)
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
    judgeLogin: function (e) {
        var that = this;
        app.showLoading();
        var that = this;
        var a = e.detail;
        if (a.errMsg == 'getUserInfo:fail auth deny') {
            wx.hideLoading();
            wx.showToast({
                title: '需要您授权',
                icon: 'none'
            });
        } else {
            wx.hideLoading();
            if (app.openId) {
                that.createOrder();
            }
            else {
                that.wxLogin();
            }

        }

    },
    wxLogin() {
        var that = this;
        network.wxLogin(function () {
            that.getOpenid();
        });
    },
    getOpenid: function () {
        var that = this;
        network.getOpenid(function () {
            that.createOrder();
        });

    },
    createOrder() {
        var that = this;
        network.POST({
            url: 'v14/renewal/create-order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "month": 1,
                "order_type": 8,
                "order_type_id": myid,
            },
            success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        payinfo: res.data.data[0].item
                    });
                    console.log(that.data.payinfo)
                    that.pay();
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
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
        });
    },
    pay: function (e) {
        console.log('pay_function')
        var that = this;
        network.POST({
            url: 'v13/shop-pay/order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "idsn": that.data.payinfo.order_sn,
                "type": 3,
                "openid": app.openId
            },
            success: function (res) {
                console.log(res);
                // var a = res.data.data[0];
                wx.hideLoading();
                if (res.data.code == 200) {
                    network.wxPay(res.data.data[0], function (res) {
                        // console.log(res);
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000
                        });
                        that.setData({                           
                            tabstyle: 1                           
                        })
                        that.getDetail();
                    });

                } else {
                    wx.showToast({
                        title: res.data.message
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
    tz_play:function(e){
        var that=this;
        if (!that.data.hidemoney){ 
            var playauthor='';   
            if (that.data.detail.teacher){
                playauthor = that.data.detail.teacher.Name;
            }  
            else{
                playauthor=app.idname;
            } 
            wx.navigateTo({
                url: '/pages/collegeNew/play/play?playid=' + e.currentTarget.dataset.playid + '&myid=' + myid + '&playsrc=' + e.currentTarget.dataset.playsrc + '&filetype=' + that.data.detail.ClassType + '&topimg=' + that.data.detail.LessonImage + '&playauthor=' + playauthor,
            })
        }
        else{
            wx.showToast({
                title: '先购买才能够观看哦',
                icon: 'none',
                duration: 1000
            })
        }
    }
})