// pages/top/top.js
var network = require("../../utils/network.js");
const app = getApp();
var hasmore = '';
var page = 1;

Page({

  data: {
      showEmpty: false,
      list: [],
  },

  onLoad: function (options) {
      var that=this;
      that.compontNavbar = that.selectComponent("#compontNavbar");
      that.empty = that.selectComponent("#empty");
      that.getList(false); 
  },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v16/topic/index',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "c_id": '',
                
            },
            success: function (res) {
                //   console.log(res); 
                wx.hideLoading();
                if (res.data.code == 200) {
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
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/topic/topic_vote/topic_vote?id=' + e.currentTarget.dataset.myid,
        })
    },
  onShow: function () {

  },

})