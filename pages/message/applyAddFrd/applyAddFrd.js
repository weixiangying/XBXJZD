const network = require("../../../utils/network.js");
const app = getApp();
var applyMsg = '';
var remark = '';
var id = '';

Page({
    data: {
        base: '../../../'
    },
    onLoad: function(options) {
        id = options.id;
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function() {

    },
    applyInput(e){
        applyMsg = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    inputFn(e) {
        remark = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    send(){
        var that = this;  
        network.POST({
            url: 'v4/friend/create',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "type": 1,
                "message": applyMsg,
                "remark": remark,
                "user_id": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '发送成功'
                    });
                    wx.redirectTo({
                        url: '/pages/message/frdList/frdList'
                    })
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
    onUnload: function() {

    }
})