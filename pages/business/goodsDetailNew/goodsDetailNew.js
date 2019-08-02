// pages/business/goodsDetailNew/goodsDetailNew.js
var network = require("../../../utils/network.js");
const wxParse = require('../../../wxParse/wxParse.js');
const app = getApp();
var page = 1;
var id = '';

Page({

    data: {
        detail: '',
        tel: app.contactTel,

        showDeclare: false,
        num: 1,
        showNumBox: false,
        btnflag: '',
        commentList: [],
        base: '../../../',
    },
    onLoad: function (options) {
        id = options.id;
        // id=494;    
    },
    onShow() {
        var that = this;
        that.getDetail();
        that.getCommentList();
    },
    //点击收藏
    clickCollect: function () {
        var that = this;
        //已收藏改为未收藏
        if (that.data.isCollect == 1) {
            that.sendDel();
        }
        else {
            that.addCollect();
        }
    },
    //收藏
    addCollect() {
        var that = this;
        network.collect(15, id, function (res) {
            // console.log(res);
            that.setData({
                isCollect: 1
            });
            wx.showToast({
                title: '已收藏',
                duration: 1000
            });
        });
    },
    //取消收藏
    sendDel() {
        var that = this;
        network.POST({
            url: 'v14/news/collect-del-all',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "collectid": JSON.stringify({ '0': id })
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        isCollect: 0
                    });
                    wx.showToast({
                        title: '取消收藏',
                        duration: 1000
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
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v13/shop-goods/details',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                var a = res.data.data[0];
                if (res.data.code == 200) {
                    that.setData({
                        detail: a,
                        description: a.item.description,
                        isCollect: a.has_collect
                    });
                    wxParse.wxParse('description', 'html', a.item.description, that, 5);
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
    getCommentList: function () {
        var that = this;
        network.POST({
            url: 'v14/news/comments-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "resourcetypeid": 15,
                "resourceid": id
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                var a = res.data.data[0].list;
                if (res.data.code == 200) {
                    that.setData({
                        commentList: a
                    });
                    // console.log(that.data.commentList.length)
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
    //点击进入商店
    into_business: function (e) {
        wx.navigateTo({
            url: '/pages/business/businessDetail/businessDetail?businessid=' + e.currentTarget.dataset.businessid
        })
    },
    //客服
    makePhone(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        })
    },
    modifNumClick(e) {
        var that = this;
        var detail = that.data.detail;
        var a = e.currentTarget.dataset;
        var num = that.data.num;
        var maxnum = detail.item.total_num - detail.item.sales_num;
        // console.log(a);
        if (a.status == 1) {
            if (num > 1) {
                that.setData({
                    num: --num
                });
            }
        }
        if (a.status == 2) {
            if (num < maxnum) {
                that.setData({
                    num: ++num
                });
            } else {
                wx.showToast({
                    title: '库存不足',
                    icon: 'none',
                });
            }
        }
    },
    addGift() {
        var that = this;
        network.POST({
            url: 'v13/shop-cart/add',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "s_id": that.data.detail.item.s_id,
                "num": that.data.num
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        showNumBox: false,
                        btnflag: ''
                    });
                    wx.showToast({
                        title: '添加成功'
                    });
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
    toComfirmOrder() {
        var that = this;
        // console.log(that.data.detail);
        network.POST({
            url: 'v13/shop-order/buy',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "s_id": that.data.detail.s_id,
                "num": that.data.num
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.setStorageSync("goods", res.data.data[0]);
                    that.setData({
                        btnflag: '',
                        showNumBox: false
                    });
                    // wx.navigateTo({
                    //     url: '/pages/periphery/confirmOrder/confirmOrder?flag=1'
                    // })
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
    showNumBox(e) {
        // console.log(e)
        var that = this;
        that.setData({
            showNumBox: true,
            btnflag: e.currentTarget.dataset.flag
        });
    },
    hideNumBox() {
        this.setData({
            btnflag: '',
            showNumBox: false
        });
    },
    comfimNumFn() {
        var that = this;
        var a = that.data.btnflag;
        if (a == 1) {
            that.addGift();
        } else {
            that.toComfirmOrder();
        }
    },
    makePhone(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        })
    },
    showDeclare() {
        this.setData({
            showDeclare: true
        });
    },
    hideDeclare() {
        this.setData({
            showDeclare: false
        });
    },
    toGift() {
        wx.navigateTo({
            url: '/pages/periphery/gift/gift?id=' + id,
        })
    }
})