// pages/zuoye/zuoyeDetail/zuoyeDetail.js
var network = require("../../../utils/network.js");
const app = getApp();

var id = '';
Page({

    data: {

        list: [],
        userInfo: [],
        listPg: [],
    },

    onLoad: function (options) {

        id = options.id;
        this.getList();
        this.getPgList();
        this.getPgTypeoneList();


    },
    onShow: function () {

    },
    goBack(e) {
        wx.navigateBack({
            delta: 1
        });
    },
    tz_canvas: function (e) {
        wx.navigateTo({
            url: "/pages/canvas/canvas?canvas=" + e.currentTarget.dataset.canvas
        })
    },
    previewImg(e) {

        var a = e.currentTarget.dataset;

        var c = a.imgs.split(' ');

        network.previewImg(a.img, c);
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v14/home-work-custom/detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id,
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        list: a,
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
    getPgTypeoneList: function (flag) {
        var that = this;
        network.POST({
            url: 'v14/home-work-custom/answer-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "customid": id,
                "an_type": 1,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    var listPg = [];

                    listPg = that.data.listPg.concat(a);

                    that.setData({
                        listPg: listPg,
                    });
                    // console.log(that.data.listPg)

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
    getPgList: function (flag) {
        var that = this;
        network.POST({
            url: 'v14/home-work-custom/answer-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "customid": id,
                "an_type": 2,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;

                    for (var i = 0; i < a.length; i++) {
                        a[i].newjson = JSON.parse(a[i].video_json)
                        a[i].newcoverimg = JSON.parse(a[i].video_json).coverImg
                    }

                    var listPg = that.data.listPg.concat(a);
                    that.setData({
                        listPg: listPg,
                    });
                    // console.log(that.data.listPg)

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
})
