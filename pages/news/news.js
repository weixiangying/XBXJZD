const network = require("../../utils/network.js");
// var network = require("../../utils/network.js");

const app = getApp();
var page = 1;
var hasmore = null;

Page({
    data: {
        news: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.empty = this.selectComponent("#empty");
    },
    getNewsList: function (flag) {
        var that = this;
        network.getNews(page, function (res) {
            wx.hideLoading();
            if (res.data.code == 200) {                
                var a=res.data.data[0].list
                if (flag) {
                    var a = that.data.news.concat(a);
                }                          
                that.setData({
                    news: a,
                    showEmpty: a.length == 0? true: false
                });
                hasmore = res.data.data[0].hasmore;
            } else {
               
                wx.showToast({
                  title: res.data.message,
                  image: '../../images/error.png',
                  duration: 1000
                });
            }
        }, function () {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                image: '../../images/error.png',
                duration: 1000
            });
        });
    },
    onShow: function () {
        var that = this;
        that.getNewsList(false);
    },
    onReachBottom: function () {
        var that = this;
        if (that.data.news.length > 0){
            if (hasmore) {
                page++;
                that.getNewsList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    image: '../../images/error.png',
                    duration: 1000
                })
            }
        }
    },
    onUnload: function(e){
        page = 1;
        hasmore = '';
    
        this.setData({
            showEmpty: false,
            news:''
        });
    },
    toDetail: function (e) {
        var that=this;
        wx.navigateTo({
            url: '/pages/news/newsDetail/newsDetail?id=' + e.currentTarget.dataset.newsid,
        })
        
    }
})