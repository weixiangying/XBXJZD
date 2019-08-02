const network = require("../../../utils/network.js");
const moment = require("../../../utils/moment.js");
const app = getApp();
var msgtosend = '';
var info = null;
var page = 1;



Page({
    data: {
        base: '../../../',
        list: []
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        info = JSON.parse(options.info);
        // console.log(info);

        if (info.ishot == 1) {
            this.getHotList(info.hid);
        } else if (info.ishot == 0) {
            this.getTypeList();
        } else {
            this.setData({
                list: [{
                    isSelf: false,
                    results: [{
                        values: {
                            text: '哈喽，我是小A客服，请问有什么可以帮您的?',
                            isLink: false,
                            id: '',
                            index: 0
                        }
                    }],
                    time: new Date(),
                    timeStr: moment().format('HH:MM')
                }]
            });
        }
    },
    onShow: function() {},
    getTypeList() {
        var that = this;
        network.POST({
            url: 'v14/help-center/help-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "typeid": info.typeid,
                "ishot": 0
            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    var b = that.data.list;
                    var c = [{
                        values: {
                            text: '哈喽，我是小A客服，您是不是要咨询以下问题：',
                            isLink: false,
                            id: '',
                            index: 0
                        }
                    }];

                    for(var i = 0; i < a.length; i++){      
                        c.push({
                            values: {
                                text: a[i].title,
                                id: a[i].id,
                                isLink: true,
                                index: i + 1
                            }
                        });
                    }

                    b.push({
                        isSelf: false,
                        results: c,
                        time: new Date(),
                        timeStr: moment().format('HH:MM')
                    });

                    that.setData({
                        list: b
                    });
                    // console.log(that.data.list);
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    getHotList(hid) {
        var that = this;
        network.POST({
            url: 'v14/help-center/help-detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "hid": hid
            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    var b = that.data.list;
                    var c = [];
                    if (a.type == 1) {
                        b.push({
                            isSelf: false,
                            results: [{
                                values: {
                                    text: a.content,
                                    id: '',
                                    isLink: false,
                                    index: 0
                                }
                            }],
                            time: new Date(),
                            timeStr: moment().format('HH:MM')
                        });
                    } else if (a.type == 2) {
                        for (var i = 0; i < a.subclassification.length; i++) {
                            c.push({
                                values: {
                                    text: a.subclassification[i].title,
                                    id: a.subclassification[i].id,
                                    pid: a.subclassification[i].pid,
                                    isLink: true,
                                    index: i + 1
                                }
                            });
                        }
                        b.push({
                            isSelf: false,
                            results: c,
                            time: new Date(),
                            timeStr: moment().format('HH:MM')
                        });
                    }
                    that.setData({
                        list: b
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    getDetail(e){
        var that = this;
        var a = e.currentTarget.dataset.hid;
        if(a){
            that.getHotList(a);
        }
    },
    inputFn(e) {
        msgtosend = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    sendMsg() {
        if (msgtosend){
            var that = this;
            var a = that.data.list;
            a.push({
                isSelf: true,
                text: msgtosend,
                img: app.userInfo.avatar,
                name: app.userInfo.nickname,
                time: new Date(),
                timeStr: moment().format('HH:MM')
            });
            wx.request({
                url: app.tulingUrl,
                method: 'POST',
                data: {
                    "reqType": 0,
                    "perception": {
                        "inputText": {
                            "text": msgtosend
                        },
                        "inputImage": {
                            "url": ""
                        },
                        "selfInfo": {}
                    },
                    "userInfo": {
                        "apiKey": app.tulingKey,
                        "userId": app.userInfo.id
                    }
                },
                success(res) {
                    // console.log(res);
                    if (res.statusCode == 200) {
                        a.push({
                            isSelf: false,
                            results: res.data.results,
                            isLink: false,
                            id: '',
                            index: 0,
                            time: new Date(),
                            timeStr: moment().format('HH:MM')
                        });
                    }
                    that.pageScroll();         
                },
                fail(err) {
                    console.log(err);
                    if (err.errMsg == 'request:fail ssl hand shake error') {
                        wx.showToast({
                            title: 'SSL握手失败',
                            icon: 'none'
                        })
                    }
                },
                complete() {
                    that.setData({
                        list: a
                    });
                    // console.log(that.data.list);
                    that.clearInput();
                }
            });
        }
    },
    pageScroll: function () {
        // console.log('pagescrollto')
        wx.createSelectorQuery().select('#box').boundingClientRect(function (rect) {
            // 使页面滚动到底部
            wx.pageScrollTo({
                scrollTop: rect.bottom
            })
        }).exec()
    },
    clearInput: function() {
        msgtosend = '';
        this.setData({
            msg: ''
        });
    },
    onUnload: function() {
        msgtosend = '';
        this.setData({
            list: [{
                isSelf: false,
                results: [{
                    values: {
                        text: '哈喽，我是小A客服，请问有什么可以帮您的?'
                    }
                }],
                time: new Date(),
                timeStr: moment().format('HH:MM')
            }]
        });
        page = 1;
    }
})