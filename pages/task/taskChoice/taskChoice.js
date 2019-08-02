// pages/task/taskChoice/taskChoice.js
const network = require("../../../utils/network.js");
const app = getApp();
var search = '';
var hasmore = '';
var page = 1;
Page({


    data: {
        showEmpty: false,
        list: [],
        search: '',

        stulist: [],
        goodslist: [],

        newbox: false,
        goodstemp: [],
    },

    onLoad: function (options) {
        var that = this;
        that.compontNavbar = this.selectComponent("#compontNavbar");
        that.empty = that.selectComponent("#empty");
        that.getList(false);
    },
    choice: function (e) {
        var index = e.currentTarget.dataset.id; //第几个
        var list = this.data.list;
        var temp = list[index]; //临时


        if (wx.getStorageSync('goodsids').length != '') {
            var stulist = wx.getStorageSync('goodsids');
        }
        else {
            var stulist = [];
        }
        // console.log(temp.checked)

        if (typeof (temp.checked) == 'undefined') { // 第一次选中
            if (stulist.length == 3) {
                wx.showToast({
                    icon: 'none',
                    title: '不能再多了',
                })
            } else {
                temp.checked = true;
                if (stulist.length > 0) {
                    var j = 0; // 判断里头有没有选中过的学生 0: 没有  1: 有
                    for (var i = 0; i < stulist.length; i++) {
                        if (stulist[i] == temp.id) {
                            j = 1;
                        }
                    }
                    if (j == 0) {
                        stulist.push(temp.id);
                    }
                } else {
                    stulist.push(temp.id);
                }
            }
        } else {
            if (temp.checked == true) { // 取消选中
                temp.checked = false;
                var j = 0; // 设置要删除的数组下标
                for (var i = 0; i < stulist.length; i++) {
                    if (stulist[i] == temp.id) {
                        j = i;
                    }
                }
                stulist.splice(j, 1)
            } else if (temp.checked == false) {  // 第二次选中
                if (stulist.length == 3) {
                    wx.showToast({
                        icon: 'none',
                        title: '不能再多了',
                    })
                } else {
                    temp.checked = true;
                    stulist.push(temp.id)
                }

            }
        }
        list[index] = temp;
        this.setData({
            list: list,
            stulist: stulist
        })
        // console.log(stulist)


        var that = this;
        var goodslist = [];
        for (var c = 0; c < stulist.length; c++) {
            for (var d = 0; d < that.data.list.length; d++) {
                if (stulist[c] == that.data.list[d].id) {
                    goodslist.push(that.data.list[d]);
                }
            }
        }
        that.setData({
            goodslist: goodslist
        })
        // console.log(that.data.goodslist)
        wx.setStorage({
            key: 'goodsids',
            data: that.data.stulist,
        })
        wx.setStorage({
            key: 'goods',
            data: that.data.goodslist,
        })

    },
    choicegoods: function (e) {
        // console.log(e.currentTarget.dataset.id)
        // var index = e.currentTarget.dataset.id;
        // var goodslist = wx.getStorageSync('goods');
        // var temp = goodslist[index];

        var index = e.currentTarget.dataset.id;
        var list = this.data.goodstemp;
        var temp = list[index];

        // console.log(list)

        var stulist = wx.getStorageSync('goodsids');

        if (temp.checked == true) { // 取消选中

            temp.checked = false;
            var j = 0; // 设置要删除的数组下标
            for (var i = 0; i < stulist.length; i++) {
                if (stulist[i] == temp.id) {
                    j = i;
                }
            }
            stulist.splice(j, 1)
        } else if (temp.checked == false) {  // 第二次选中

            if (stulist.length == 3) {
                wx.showToast({
                    icon: 'none',
                    title: '不能再多了',
                })
            } else {
                temp.checked = true;
                stulist.push(temp.id)
            }

        }

        list[index] = temp;
        this.setData({
            goodstemp: list,
            stulist: stulist
        })
        // console.log(stulist)


        var that = this;
        var goodslist = [];
        for (var c = 0; c < stulist.length; c++) {
            for (var d = 0; d < that.data.goodstemp.length; d++) {
                if (stulist[c] == that.data.goodstemp[d].id) {
                    goodslist.push(that.data.goodstemp[d]);
                }
            }
        }
        that.setData({
            goodslist: goodslist
        })
        // console.log(that.data.goodslist)
        wx.setStorage({
            key: 'goodsids',
            data: that.data.stulist,
        })
        wx.setStorage({
            key: 'goods',
            data: that.data.goodslist,
        })

        for (var i = 0; i < stulist.length; i++) {
            for (var j = 0; j < that.data.list.length; j++) {
                if (stulist[i] == that.data.list[j].id) {
                    that.data.list[j].checked = true;
                }
            }
        }
        that.setData({
            list: that.data.list
        })
    },
    click_firm: function (e) {
        var that = this;
        // console.log(that.data.stulist)
        // console.log(that.data.stulist.length)
        if (that.data.stulist.length == 0) {
            wx.showToast({
                title: '请选择商品',
                icon: 'none',
                duration: 1000
            })
        }
        else {
            wx.setStorage({
                key: 'goodsids',
                data: that.data.stulist,
            })
            wx.setStorage({
                key: 'goods',
                data: that.data.goodslist,
            })
            wx.navigateBack({

            })

        }
    },
    onShow: function () {

    },
    saveSearch: function (e) {
        search = e.detail.value.replace(/^\s*|\s*$/, '');
        // console.log(search)
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v13/shop-goods/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "search": search,
                // "c_id": '1',

            },
            success: function (res) {
                //   console.log(res); 
                wx.hideLoading();
                if (res.data.code == 200) {
                    search = '';
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    // console.log(that.data.questionList);          
                    hasmore = res.data.data[0].hasmore;
                    var goods = wx.getStorageSync('goods');
                    for (var i = 0; i < goods.length; i++) {
                        for (var j = 0; j < a.length; j++) {
                            if (goods[i].id == a[j].id) {
                                a[j].checked = true;
                            }
                        }
                    }
                    that.setData({
                        list: a,
                        goodslist: goods
                    })
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
    submit: function (e) {
        this.getList(false);
    },
    onReachBottom: function () {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    },
    backReturn: function () {
        var that = this;
        wx.setStorage({
            key: 'goods',
            data: that.data.goodslist,
        })
        wx.setStorage({
            key: 'goodsids',
            data: that.data.stulist,
        })
        wx.navigateBack({
            delta: 1
        });
    },
    click_see: function () {
        var that = this;
        // var goods = wx.getStorageSync('goods');
        that.setData({
            newbox: true,
            goodstemp: that.data.goodslist
        })
    },
    click_newbox_btn: function () {
        var that = this;
        that.setData({
            newbox: false,
        })
        that.getList(false);
    },
    click_clear: function () {
        var that = this;

        var goodstemp = that.data.goodstemp;

        for (var i = 0; i < goodstemp.length; i++) {
            goodstemp[i].checked = false;
        }
        that.setData({
            goodstemp: goodstemp,
            goodsids: [],
            goods: [],
            goodslist: [],
            stulist: [],
        })

        wx.setStorage({
            key: 'goodsids',
            data: [],
        })
        wx.setStorage({
            key: 'goods',
            data: [],
        })


    },
})