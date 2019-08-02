// pages/jiameng/jiameng.js
var network = require("../../utils/network.js");
const app = getApp();

Page({

    data: {
        base: '../../',
    },

    onLoad: function (options) {
        var that=this;
        that.getCheck();
    },
    judgeLogin: function (e) {
        var that = this;
        app.showLoading();
        var that = this;
        var a = e.detail;
        if (a.errMsg == 'getUserInfo:fail auth deny') {
            wx.hideLoading();
            wx.showToast({
                title: '需要您授权',
                icon: 'none'
            });
        } else {
            wx.hideLoading();
            if (app.openId) {
                that.createOrder();
            }
            else {
                that.wxLogin();
            }

        }

    },

    wxLogin() {
        var that = this;
        network.wxLogin(function () {
            that.getOpenid();
        });
    },
    getOpenid: function () {
        var that = this;
        network.getOpenid(function () {
            that.createOrder();
        });

    },
    createOrder() {
        var that = this;
        network.POST({
            url: 'v14/renewal/create-order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "month": 1,
                "order_type": 5,
                // "order_type_id": 0,
            },
            success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        payinfo: res.data.data[0].item
                    });
                    console.log(that.data.payinfo)
                    that.pay();
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
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
        });
    },
    pay: function (e) {
        console.log('pay_function')
        var that = this;
        network.POST({
            url: 'v13/shop-pay/order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "idsn": that.data.payinfo.order_sn,
                "type": 3,
                "openid": app.openId
            },
            success: function (res) {
                console.log(res);
                // var a = res.data.data[0];
                wx.hideLoading();
                if (res.data.code == 200) {
                    network.wxPay(res.data.data[0], function (res) {
                        // console.log(res);
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success',
                            duration: 3000
                        });
                        wx.navigateTo({
                            url: '/pages/home/home',
                        })
                    });

                } else {
                    wx.showToast({
                        title: res.data.message
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
    getCheck: function () {
        var that = this;
        network.POST({
            url: 'v14/renewal/check',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "order_type": 5,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;

                    if (a.is_end == 1) {
                        that.setData({
                           
                            payMoney: a.unit_price
                        })
                    }
                    else {
                        that.setData({
                            
                            payMoney: a.unit_price
                        })
                    }

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
        //   console.log(that.data.showTalk)
    },
})