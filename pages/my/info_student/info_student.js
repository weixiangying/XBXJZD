// pages/my/info_student/info_student.js
const network = require("../../../utils/network.js");
const app = getApp();
var user_id='';
var user_mobile='';


Page({
    data: {
       
        
        info: '',
       
    },
    onLoad: function (options){
        var that = this;
        // console.log(options)
        user_id =options.uid;
        
        that.setData({
            strschool: options.strschool,
            strgrade: options.strgrade
        })
        that.getUserInfo();
    },
    
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function (res) {
            wx.hideLoading();
            // console.log(res)
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                that.setData({
                    info: a,
                   
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    image: '../../../images/error.png',
                    duration: 1000
                });
            }
        }, user_id, user_mobile);

    },
    bind_off:function(){
        var that=this;
        wx.showModal({
            title: '提示',
            content: '您确定解除该绑定吗？',
            success(res) {
                if (res.confirm) {
                    network.POST({
                        url: 'v16/user-bind/del',
                        params: {
                            'mobile': app.userInfo.mobile,
                            'token': app.userInfo.token,
                            'user_id': user_id,

                        },
                        success: function (res) {
                            wx.hideLoading();
                            // console.log(res);
                            if (res.data.code == 200) {
                                wx.showToast({
                                    title: '解除绑定成功',
                                    duration: 1000,
                                    success: function () {
                                        wx.navigateBack({
                                            delta: 1
                                        });
                                    }
                                })

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
                    })
                } 
            }
        })
        
    }
    
})