const network = require("../../../utils/network.js");
const app = getApp();
var page = 1;
var search = '';


Page({
    data: {
        base: '../../../',
        list: [],
        addList: [],
        showEmpty: false,
        isShowAddList: false
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function() {
        this.getList();
    },
    //被添加好友列表
    getList() {
        var that = this;
        network.POST({
            url: 'v9/friend/friend-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0? true : false
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
    toDetail(e){
        var a = e.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/message/frdDetail/frdDetail?id=' + a.id + '&mobile=' + a.mobile
        })
    },
    addFrd(e){
        var that = this;
        var a = e.currentTarget.dataset;
        network.POST({
            url: 'v4/friends/do-friend',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "type": a.ty,
                "from_uid": a.id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '已添加',
                        icon: 'none'
                    });
                    that.getList();
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
    //新同学列表
    getAddList() {
        var that = this;
        network.POST({
            url: 'v9/user/userlist-for-community',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "community_id": app.userInfo.register_community_id,
                "page": page,
                "search": search
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data;
                    that.setData({
                        addList: a,
                        isShowAddList: true
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
    showAddList(){
        this.getAddList();
    },
    inputFn(e){
        search = e.detail.value.replace(/^\s*|\s*$/, '');
        // console.log(search);
    },
    confirmFn(){
        this.getAddList();
    }
})