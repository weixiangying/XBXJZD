// pages/my/aboutMoney/memberRenewalNewDel/memberRenewalNewDel.js
const network = require("../../../../utils/network.js");
const app = getApp();
var type = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        base: '../../../../',
        list: []
    },

    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");

        var that = this;
        var a = options.mytype;
        
            that.setData({
                title: '收入明细'
            })
            type = 9;
       
        
        that.getList();
    },
    getList() {
        var that = this;
        network.POST({
            url: 'v12/my-should/trading-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "type": type,

            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        list: res.data.data[0].list,
                        showEmpty: res.data.data[0].list.length == 0 ? true : false
                    });
                    // console.log(that.data.showEmpty)
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    })
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
})