// pages/course/periphery/periphery.js
const network = require("../../../utils/network.js");
const app = getApp();
var page = 1;
var hasmore = '';
var search = '', index = null;


Page({
    data: {
        IMGURL: app.imgUrl,
        tabIndex: 1,
        hotList: [],
        list: [],
        showEmpty: false,
        userInfo: app.userInfo,
        search: '',
        cartCount: 0,
        showSearch: true,
        peripheryCourse: [],
        focus: true,
    },
    onLoad: function (options) {
        // console.log(options);
        // if (options.showSearchType==2){
        //   this.setData({
        //     showSearch: true,
        //     focus: true
        //   })
        // }
        // else{
        //   this.setData({

        //     peripherySearchHis: app.peripherySearchHis
        //   })
        // }

        this.setData({
            showSearch: true,
            focus: true,
            peripheryCourse: app.peripheryCourse
        })


        this.empty = this.selectComponent("#empty");
        
        // this.search = this.selectComponent("#search");



    },

    saveSearch: function (e) {
        // console.log(this.data.showSearch)
        search = e.detail.value.replace(/^\s*|\s*$/, '');
        // console.log(search)
    },
    backReturn: function () {
        wx.navigateBack({
        })
    },
    submit: function (e) {
        // console.log(search)    
        app.peripheryCourse.push(search);
        // console.log(app.peripherySearchHis) 

        var that = this;
        that.setData({
            search: e.detail.value,
            peripheryCourse: app.peripheryCourse
        });

        that.hideSearch();
        wx.navigateTo({
            url: '/pages/course/courseSearchBefore/courseSearchBefore?search=' + search,
        })

    },
    tapHisItem: function (e) {
        var that = this;
        search = e.currentTarget.dataset.val;
        that.setData({
            search: search
        });

        that.hideSearch();
        wx.navigateTo({
            url: '/pages/course/courseSearchBefore/courseSearchBefore?search=' + search,
        })
    },
    clearHis: function () {
        app.peripheryCourse = [];

        this.setData({
            peripheryCourse: []
        });
    },
    showSearch() {
        this.setData({
            showSearch: true
        });
    },
    hideSearch() {
        this.setData({
            showSearch: false
        });
    },

    onShow: function () {
        this.setData({
            peripheryCourse: app.peripheryCourse
        })
        var that = this;


    },





})