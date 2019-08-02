// pages/task/growup/growup.js
const network = require("../../../utils/network.js");
const app = getApp();
var page = 1;
var hasmore = null;
Page({
    data: {
        list: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v16/growth/growth-problem',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": 1,               
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list
                    if (flag) {
                        var a = that.data.list.concat(a);
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
    onShow: function () {
        var that = this;
        that.getList(false);
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
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
        }
    },
    tz_detail: function (e) {
        var that = this;
        wx.navigateTo({
            url: '/pages/task/growupDetail/growupDetail?id=' + e.currentTarget.dataset.listid,
        })

    }
})