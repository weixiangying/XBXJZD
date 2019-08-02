const network = require("../../../utils/network.js");
const app = getApp();
var page = 1;

Page({
    data: {
        list: [],
        showEmpty: false
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow: function() {
        this.getList();
    },
    getList(){
        var that = this;
        network.POST({
            url: 'v8/user-group/group-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "page_size": 10
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
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
    enterLive(e) {
        var a = e.currentTarget.dataset.item;
        // console.log(a);
        app.selType = 'GROUP';
        app.C2C_Info = null;
        app.GROUP_Info = {
            selToID: a.group_id,
            type: 'GROUP',
            GroupNick: a.name,
            GroupImage: a.image
        }
        
        wx.navigateTo({
            url: '/pages/message/liveRoom/liveRoom'
        })
    },
    onUnload: function() {

    }
})