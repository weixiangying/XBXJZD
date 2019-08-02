// pages/memberCenter/memberCenter.js
// var network = require("../../utils/network.js");
// const app = getApp();
// Page({

//     /**
//      * 页面的初始数据
//      */
//     data: {
//         base: '../../',
//         list:[],
        
//     },

//     onLoad: function (options) {
//         var that=this;
//         that.setData({
//             list:[
//                 { id: 1, title:'年费会员',money:988,ymoney:1056},
//                 { id: 2, title: '季度会员', money: 254, ymoney: 264 },
//                 { id: 3, title: '月度会员', money: 88, ymoney: 99 },
//             ]
//         })
//         that.moren();
//     },
//     moren:function(){
//         var that=this;
//         var list=that.data.list;
//         that.setData({
//             myid: list[0].id,
//             newmoney: list[0].money,
//             savemoney: list[0].ymoney - list[0].money,
//         })
        
//     },
//     choice_item: function (e) {
//         var that=this;
//         // console.log(e.currentTarget.dataset.myid)
//         var a = e.currentTarget.dataset.myid
//         that.setData({
//             myid: a
//         })
//         var list = that.data.list
//         for(var i=0;i<list.length;i++){
//             if(a==list[i].id){
//                 that.setData({
//                     newmoney:list[i].money,
//                     savemoney: list[i].ymoney - list[i].money,
//                 })
//             }
//         }
//     },
//     onShow: function () {

//     },

// })
const network = require("../../utils/network.js");
const app = getApp();
Page({
    data: {
        base: '../../',
        info: '',
        renInfo: '',
        list: [],
        myid: 0,


    },
    onLoad: function (options) {

        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that = this;

    },
    onShow: function () {
        var that = this;

        // that.getList();

        that.getUserInfo();
        that.getRenInfo();
        // console.log(app.myopenId)
        // if (app.myopenId){
        //     that.setData({
        //         hideMask:true
        //     })
        //     that.getUserInfo();
        //     that.getRenInfo();
        // }
        // else{
        //     that.getUserInfo();
        //     that.getRenInfo();
        // }
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
    choice_item: function (e) {
        var that = this;
        // console.log(e.currentTarget.dataset.index)
        // console.log(e.currentTarget.dataset.myid)
        var a = e.currentTarget.dataset.myid
        that.setData({
            myid: a
        })
        var list = that.data.list
        for (var i = 0; i < list.length; i++) {
            if (a == list[i].id) {
                that.setData({
                    newmoney: list[i].price,
                    savemoney: list[i].dprice,
                    month: list[i].month
                })
            }
        }
    },
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                // console.log(a);
                that.setData({
                    info: a
                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        });
    },
    getRenInfo() {
        var that = this;
        network.POST({
            url: 'v14/renewal/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "order_type": 1,
                // "order_type_id": 0,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        renInfo: res.data.data[0].item,
                        list: res.data.data[0].item.price_discounts,

                    });

                    for (var i = 0; i < that.data.list.length; i++) {
                        that.data.list[i].id = i;
                    }
                    that.setData({
                        list: that.data.list,
                        myid: that.data.list[0].id,
                        newmoney: that.data.list[0].price,
                        savemoney: that.data.list[0].dprice,
                        month: that.data.list[0].month,
                    });
                    // console.log(that.data.list)
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
    createOrder() {
        var that = this;
        network.POST({
            url: 'v14/renewal/create-order',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "month": that.data.month,
                "order_type": 1,
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
                            url: '/pages/spread/spread',
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
    }
})

