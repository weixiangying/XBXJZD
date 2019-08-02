const network = require("../../../utils/network.js");
const app = getApp();
var page = 1;
var hasmore = '';
var id = '';


Page({
    data: {
        height: 'auto',
        list: [],
        msg: '',
        showId: '',
        showEmpty: false
    },
    onLoad: function (options) {
        var that = this;
        id = options.id;
        this.empty = this.selectComponent("#empty");
        this.addAgre = this.selectComponent("#addAgre");
        this.accord = this.selectComponent("#accord");
        that.getList();
    },
    inputFn: function (e) {
        this.setData({
            msg: e.detail.value
        });
    },
    getList: function () {
        var that = this;
        network.POST({
            url: 'v14/news/comments-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "resourcetypeid": 1,
                "page": page,
                "resourceid": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0? true: false
                    });
                    hasmore = res.data.data[0].hasmore;
                } else {
                    wx.showToast({
                      title: res.data.message,
                      image: '../../../images/error.png',
                      duration: 1000
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

    },
    onReachBottom: function () {
        var that = this;
        if(that.data.list.length > 0){
            if (hasmore) {
                page++;
                that.getList();
            } else {
                wx.showToast({
                    title: '没有更多了',
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
        }
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
                        that.getList();
                        that.setData({
                            msg: ''
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
            })
        }
    },
    modiHeight: function (e) {
        var b = e.currentTarget.dataset.id;
        if (this.data.showId == b) {
            this.setData({
                showId: ''
            });
        } else {
            this.setData({
                showId: b
            });
        }

    },
    onUnload (){
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    }
})