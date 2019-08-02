const network = require("../../../utils/network.js");
const webim = require('../../../utils/webim_wx.min.js');
const app = getApp();
var id = '';
var mobile = '';

Page({
    data: {
        base: '../../../',
        info: {}
    },
    onLoad: function (options) {
        // console.log(options);
        id = options.id;
        mobile = options.mobile;
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function () {
        this.getDetail();
    },
    getDetail() {
        var that = this;
        network.getUserInfo(function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
                that.setData({
                    detail: res.data.data[0].item
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: none,
                    duration: 1000
                })
            }
        }, id, mobile);
    },
    clearMsg(){
        console.log();
    },
    switchChange: function (e) {
        // console.log(e.detail.value);
        var that = this;
        network.POST({
            url: 'v10/black-list/set-black',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "black_type": e.detail.value? 0: 1,
                "type": 1,
                "user_id": id
            },
            success: function (res) {
                console.log(res);
                if (res.data.code == 200) {
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        }, true);
    },
    toDetail(e) {
        wx.navigateTo({
            url: '/pages/message/frdDetail/frdDetail?id=' + id + '&mobile=' + mobile
        })
    },
    onUnload: function () {

    }
})