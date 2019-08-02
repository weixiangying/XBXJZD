const network = require("../../../utils/network.js");
const wxParse = require('../../../wxParse/wxParse.js');
const app = getApp();
var id = '';
Page({
    data: {
        detail: '',
        msg: '',
        myagree: '',
        mycollect: '',
        mycommentnum: '',
        content: ''
    },
    onLoad: function (options) {
        var that = this;
        id = options.id;
        that.getDetail();
    },
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v14/news/detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        detail: a,
                        myagree: a.isagree,
                        mycollect: a.iscollect,
                        mynum: a.agreenum,
                        mycommentnum: a.commentnum,
                    });
                    wxParse.wxParse('content', 'html', a.content, that, 0);
                } else {

                    wx.showToast({
                        title: res.data.message,
                        image: '../../../images/error.png',
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
    inputFn: function (e) {
        this.setData({
            msg: e.detail.value
        });
    },
    submitCommt: function () {
        var that = this;
        var a = that.data.msg;
        if (a) {
            network.POST({
                url: 'v14/news/comments-add',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "resourcetypeid": 1,
                    "resourceid": id,
                    "content": a
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.message,
                        image: '../../../images/error.png',
                        duration: 1000
                    });
                    if (res.data.code == 200) {
                        that.setData({
                            msg: '',
                            mycommentnum: Number(that.data.mycommentnum) + 1
                        });
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
        } else {
            wx.showToast({
                title: '请输入内容',
                image: '../../../images/error.png',
                duration: 1000
            });
        }
    },
    toCommt: function () {
        var that = this;
        wx.navigateTo({
            url: '/pages/news/newsCommt/newsCommt?id=' + that.data.detail.id
        })
    },
    isLike: function () {
        var that = this;
        var a = that.data.myagree;
        if (a == 1) {
            wx.showToast({
                title: '您已点赞'
            })
        } else {
            that.setData({
                myagree: 1,
                mynum: Number(that.data.mynum) + 1
            });
            network.addAgree(1,id);
        }
    },
    isCollect: function () {
        var that = this;
        var a = that.data.mycollect;
        if (a == 1) {
            that.setData({
                mycollect: 0,
            });
            network.collect(1, id);
            wx.showToast({
                title: '取消收藏',
                icon: 'none',
            })
        } else {
            that.setData({
                mycollect: 1,               
            });
            network.collect(1, id);
            wx.showToast({
                title: '您已收藏',
                icon: 'none',
            })
        }
    },
    onShareAppMessage(){
        var that = this;
        return {
            title: that.data.detail.name,
            path: '/pages/news/newsDetail/newsDetail?id=' + id,
            success: function (res) {
                network.share(1, id);
            }
        };
    }
})