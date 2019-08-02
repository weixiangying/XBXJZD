// pages/business/business.js
var network = require("../../utils/network.js");
const app = getApp();
var pagesize = 20;
var page = 1;
var hasmore = null;


Page({
    data: {
        list: [],
        showEmpty: false,
        showdistance: true,
        base: '../../',
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
        var that = this;
        if (app.longitude) {
            // console.log('1111')
            that.setData({
                showdistance: true
            })
        }
        else {
            // console.log('222')
            that.setData({
                showdistance: false
            })
        }
        that.getList(false);
    },
    getList: function (contaFlag) {
        var that = this;
        network.POST({
            url: 'v13/bus-shop-goods/bus-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "lng": app.longitude,
                "lat": app.latitude,
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
    onShow: function () {

    },
    onUnload: function () {

    },
    tz_businessDetail: function (e) {
        wx.navigateTo({
            url: '/pages/business/businessDetail/businessDetail?businessid=' + e.currentTarget.dataset.businessid
        })
    },
})