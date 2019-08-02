
const network = require("../../utils/network.js");
const app = getApp();
Page({
    data: {
        base: '../../',
        info: '',
        renInfo: '',
        list: []
    },
    onLoad: function (options) {

        this.compontNavbar = this.selectComponent("#compontNavbar");

    },
    onShow: function () {
        var that = this;
        that.getUserInfo();
        that.getRenInfo();
        // that.getList();
    },
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                // console.log(a);
                that.setData({
                    info: a
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        });
    },
    getRenInfo() {
        var that = this;
        network.POST({
            url: 'v14/renewal/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "order_type": 1,
                // "order_type_id": 0,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        renInfo: res.data.data[0].item
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
    getList() {
        var that = this;
        network.POST({
            url: 'v12/my-should/trading-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "type": 9,
                // "order_type_id": 0,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        list: res.data.data[0].list
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
    tz_detail:function(e){
        
        wx.navigateTo({
            url: '/pages/spread/spreadDetail/spreadDetail?mytype=' + e.currentTarget.dataset.mytype,
        })
    }
})

