// pages/task/taskReward/taskReward.js
const network = require("../../../utils/network.js");
const app = getApp();
var search = '';
var hasmore = '';
var page = 1;
Page({

    
    data: {
        showEmpty: false,
        list: [],
        search: ''
    },

    onLoad: function (options) {
        var that = this;
        that.compontNavbar = this.selectComponent("#compontNavbar");
        that.empty = that.selectComponent("#empty");
        that.getList(false); 
    },

    onShow: function () {

    },
    saveSearch: function (e) {
        search = e.detail.value.replace(/^\s*|\s*$/, '');
        // console.log(search)
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v13/shop-goods/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "search": search,
                // "c_id": '6',
                
            },
            success: function (res) {
                //   console.log(res); 
                wx.hideLoading();
                if (res.data.code == 200) {
                    search = '';
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
    submit: function (e) {
        this.getList(false);
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
    backReturn: function () {
        wx.navigateBack({
            delta: 1
        });
    },
})