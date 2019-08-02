// pages/composition/composition.js
var network = require("../../utils/network.js");
const app = getApp();
var hasmore = '';
var page = 1;
var search='';
Page({

  data: {
      showoneHeight: 0,
      changeCss: 1,
      showEmpty: false,
      list: [],
      search:''
  },

  onLoad: function (options) {
      var that = this;
      that.setData({
          changeCss: 1
      })

      that.compontNavbar = this.selectComponent("#compontNavbar");
      that.empty = that.selectComponent("#empty");
      
      var query = wx.createSelectorQuery();
      query.select('#showone').boundingClientRect()
      query.exec(function (res) {
          that.setData({
              showoneHeight: res[0].height
          })
        //   console.log('取高度', that.data.showoneHeight);
      }) 
      that.getList(false); 
  },
    saveSearch: function (e) {
        search = e.detail.value.replace(/^\s*|\s*$/, '');
        // console.log(search)
    },
    submit: function (e) {
        this.getList(false); 
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v14/composition/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "Name": search,              
            },
            success: function (res) {
                //   console.log(res); 
                wx.hideLoading();             
                if (res.data.code == 200) {
                    search='';
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
  onShow: function () {

  },
    onPageScroll: function (ev) {  
        var that = this;
        if (ev.scrollTop < that.data.showoneHeight) {
            that.setData({
                changeCss: 1
            })
            
        } 
        else {          
            that.setData({
                changeCss: 2
            })
                   
        }
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
    goBack:function(){
        wx.navigateBack({
            delta: 1
        });
    },
    tz_detail:function(e){
       
        wx.navigateTo({
            url: '/pages/composition/compositionDetail/compositionDetail?id=' + e.currentTarget.dataset.myid,
        })
    }
})