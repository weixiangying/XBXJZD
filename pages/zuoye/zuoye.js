// pages/zuoye/zuoye.js
var network = require("../../utils/network.js");
const app = getApp();

var page = 1;
var hasmore = null;
var uid='';
Page({

    data: {

        list: [],
        showEmpty: false,
        userInfo: [],
    },

    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");

        this.setData({
            userInfo: app.userInfo
        })
        
    },
    previewImg(e) {

        var a = e.currentTarget.dataset;

        var c = a.imgs.split(' ');

        network.previewImg(a.img, c);
    },
    onShow: function () {
        var that = this;
        that.getList(false);
        
    },
    

    getList: function (flag) {
        var that = this;
        uid = wx.getStorageSync('choicestu_task');
        console.log(uid)
        network.POST({
            url: 'v14/home-work-custom/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "type": 3,
                "bu_id": uid,
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
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
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/zuoye/zuoyeDetail/zuoyeDetail?id=' + e.currentTarget.dataset.zuoyeid
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
                    image: '../../images/error.png',
                    duration: 1000
                })
            }
        }
    },
})