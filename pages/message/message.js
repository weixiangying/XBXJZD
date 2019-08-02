var network = require("../../utils/network.js");
var app = getApp();
var page = 1;


Page({
    data: {
        grouplist: [
            
        ],
        showEmpty: false
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
        this.getGroupList();
    },
    onShow: function () {
        var that = this;
        
    },
    //群列表
    getGroupList() {
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
                        grouplist: a,
                        
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
    //点击进入群
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
})