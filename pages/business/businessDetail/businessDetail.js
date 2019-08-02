// pages/business/businessDetail/businessDetail.js
var network = require("../../../utils/network.js");
const app = getApp();
var page = 1;
var hasmore = '';
var variable;

Page({
    data: {
        

        detail_tab: '',

        variable: 200,
        businessid: '',
        detail: [],
        search: '',
        currenttabid: '',
        base: '../../../',
    },
    scroll_view_click: function (e) {
        var that = this;
        // console.log(e.currentTarget.dataset.tabid)
        that.setData({
            currenttabid: e.currentTarget.dataset.tabid
        })
        that.getListnew(false);
    },
    
    onLoad: function (options) {
        // console.log(options)
        var that = this;
        that.setData({
            businessid: options.businessid
            // businessid: 1
        })
        that.getDetail();

    },
    backReturn: function () {
        wx.navigateBack({
        })
    },
    onShow() {
        
        this.getListnew(false);
        
    },

    
    getListnew: function (flag) {
        var that = this;
        network.POST({
            url: 'v13/shop-goods/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "search": that.data.search,
                "c_id": that.data.currenttabid,//系统分类
                // "cb_id": that.data.currenttabid,//商家分类
                "bid": that.data.businessid,//商家id
                "price_sort": '',
                "page": page
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.listnew.concat(a);
                    }
                    that.setData({
                        listnew: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    hasmore = res.data.data[0].hasmore;
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
        })
    },

    onReachBottom: function () {
        var that = this;
        if (that.data.listnew.length > 0) {
            if (hasmore) {
                page++;
                that.getListnew(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    //详情
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v13/bus-shop-goods/bus-info',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "bid": that.data.businessid,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        detail: a,
                        detail_tab: a.category_list
                    });
                    // console.log(that.data.detail_tab)
                    wx.getSystemInfo({
                        success: function (res) {
                            that.setData({
                                windowHeight: res.windowHeight
                            });
                            if (that.data.detail_tab.length != 0) {
                                var query = wx.createSelectorQuery();
                                query.select('#tabs').boundingClientRect(function (rect) {
                                    that.setData({
                                        tabsTotop: rect.top - res.windowHeight * 0.08,
                                    })
                                }).exec();
                            }
                        }
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
    onPageScroll: function (ev) {
        var that = this;
        if (ev.scrollTop > that.data.tabsTotop) {
            that.setData({
                changeTabsCss: true
            })
        }
        else {
            that.setData({
                changeTabsCss: false
            })
        }
    },
    //搜索
    saveSearch: function (e) {
        this.setData({
            search: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    submit: function (e) {
        var that = this;
        that.setData({
            search: e.detail.value
        });
        page = 1;
        that.getListnew(false);
    },
})
