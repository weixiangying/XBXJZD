// pages/task/growupDetail/growupDetail.js
const network = require("../../../utils/network.js");
const app = getApp();
var id='';
Page({

    
    data: {
        zhedie: 0,
        zhedie_text: '展开全部',
        zhedie_img: '../../../images/arrow_down_new.png',
      item1:[],
      list:[],
      showEmpty:false,
    },

    onLoad: function (options) {
        // console.log(options)
        this.empty = this.selectComponent("#empty");
        var that=this;
        id = options.id;
        
        that.getDetail();
    },

    onShow: function () {

    },
    // 文字折叠
    zhedie: function (e) {
        // console.log(e)
        var that = this;
        var zhedie = Number(that.data.zhedie) + 1;
        that.setData({
            zhedie: zhedie,
            // zhedie_img:'../../../images/arrow_up_new.png'
        })
        if (zhedie % 2 == 0){
            that.setData({
                zhedie_text:'展开全部',
                zhedie_img: '../../../images/arrow_down_new.png'
            })
        }
        else{
            that.setData({
                zhedie_text: '收缩',
                zhedie_img: '../../../images/arrow_up_new.png'
            })
        }
    },
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v16/growth/growth-detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "gid": id
            },
            success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({
                        item1:a.item,
                        list: a.list,
                        showEmpty: a.list.length == 0 ? true : false
                        // agreenum: a.list.agreenum,
                        // isagree: a.list.isagree,
                        // sharenum: a.list.sharenum,
                        // task:a.item
                    });
                    
                } else {

                    wx.showToast({
                        title: res.data.message,
                        image: '../../../images/error.png',
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
    isLike: function () {
        var that = this;
        var a = that.data.isagree;
        if (a == 1) {
            wx.showToast({
                title: '您已支持'
            })
        } else {
            that.setData({
                isagree: 1,
                agreenum: Number(that.data.agreenum) + 1
            });
            network.addAgree(22, id);
        }
    },
    onShareAppMessage() {
        var that = this;
        return {
            title: that.data.list.name,
            path: '/pages/task/growupDetail/growupDetail?id=' + id,
            success: function (res) {
                network.share(22, id);
                that.setData({
                    sharenum: Number(that.data.sharenum)+1
                })
                // console.log(that.data.sharenum)
            }
        };
    },
    goback:function(){
        wx.navigateBack({
            
        })
    },
    click_btn: function () {
        wx.navigateTo({
            url: '/pages/task/arrange/arrange',
        })
    },
})