const network = require("../../../utils/network.js");
const app = getApp();


Page({
    data: {
        base: '../../../',
        info: {}
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function() {
        this.getGroupInfo();
    },
    getGroupInfo(){
        var that = this;
        network.POST({
            url: 'v10/group/group-get',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "group_id": app.GROUP_Info.selToID,
                "page": -1
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        info: res.data.data
                    });
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
    toDetail(e) {
        var a = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/message/frdDetail/frdDetail?id=' + a.id + '&mobile=' + a.mobile
        })
    },
    onUnload: function() {

    }
})