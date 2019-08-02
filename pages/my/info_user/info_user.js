// pages/my/info_user/info_user.js
const network = require("../../../utils/network.js");
const app = getApp();

Page({


  data: {
      headImg:'',
  },

  onLoad: function (options) {
    //   var that=this;
    //   that.getUserInfo();
      
      
  },
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function (res) {
            wx.hideLoading();
            // console.log(res)
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                that.setData({
                    info: a,

                });
            } else {
                wx.showToast({
                    title: res.data.message,
                    image: '../../../images/error.png',
                    duration: 1000
                });
            }
        });

    },
    getModify: function (img){
        var that=this;
        network.modifyPartInfo({ "avatar": img }, function (res) {
            // console.log(res)
           
            var b = wx.getStorageSync('userInfo');
                       
            if (res.data.code == 200) {
                b.avatar = app.userInfo.avatar = img;               
                wx.setStorageSync('userInfo', b);              
                that.getUserInfo();
            }
        });
    },
    modHead: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                

                network.publicUpload(res.tempFilePaths, function (res) {
                    // console.log(res);
                    var img = res.data[0].list[0].file_url;
                    // console.log(img);
                    if (img) {
                        that.getModify(img);
                    } else {
                        wx.showToast({
                            title: '上传失败',
                            icon: 'none'
                        })
                    }
                });  
            }
        });
    },
    
  onShow: function () {
      var that = this;
      that.getUserInfo();
  },
    exitLogin: function () {
        wx.showModal({
            title: '提示',
            content: '您确定退出登录吗？',
            success(res) {
                if (res.confirm) {
                    wx.clearStorageSync();
                    wx.reLaunch({
                        url: '/pages/login/login'
                    })
                }
            }
        })
        
    }
})