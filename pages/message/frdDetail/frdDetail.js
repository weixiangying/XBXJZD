const network = require("../../../utils/network.js");
const app = getApp();
var id = '';
var mobile = '';

Page({
    data: {
        base: '../../../',
        photos: [],
        detail: ''
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        id = options.id;
        mobile = options.mobile;
    },
    onShow: function() {
        this.getDetail();
    },
    getDetail(){
        var that = this;
        network.getUserInfo(function (res) { 
            // console.log(res);
            wx.hideLoading();
            if(res.data.code == 200){
                that.setData({
                    detail: res.data.data[0].item,
                    photos: res.data.data[0].post_photo
                });
            }else{
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                })
            }
        }, id, mobile);
    },
    addFrd(){
        var that = this;
        wx.navigateTo({
            url: '/pages/message/applyAddFrd/applyAddFrd?id=' + + that.data.detail.uid
        })
    },
    //????
    // toClassmate(){
    //     var that = this;
    //     wx.navigateTo({
    //         url: '/pages/message/myClassmate/myClassmate?mobile=' + that.data.detail.mobile
    //     })
    // },
    toRemarks(){
        wx.navigateTo({
            url: '/pages/message/setRemarks/setRemarks?id=' + id
        })
    },
    enterLive() {
        var a = this.data.detail;
        app.selType = 'C2C';
        app.GROUP_Info = null;
        app.C2C_Info = {
            selToID: a.uid,
            type: 'C2C',
            C2cNick: a.friend_remark || a.nickname,
            C2cImage: a.avatar
        }
        wx.navigateTo({
            url: '/pages/message/liveRoom/liveRoom'
        })
    },
    onUnload: function() {

    }
})