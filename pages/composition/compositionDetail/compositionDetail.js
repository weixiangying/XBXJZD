// pages/composition/compositionDetail/compositionDetail.js
var network = require("../../../utils/network.js");
const app = getApp();
var id = '';

Page({

  data: {

  },

  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
      id = options.id;
    //  id=1;
      this.getDetail();
  },
    getDetail() {
        var that = this;
        network.POST({
            url: 'v14/composition/detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": id
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        detail: res.data.data[0].item
                    });
                    var content = that.data.detail.Content;
                    
                    
                    var newcontent;
                    newcontent = content.split("\n");

                    that.setData({
                        newcontent: newcontent
                    })
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
    // isCollect: function () {
    //     var that = this;
    //     var a = that.data.mycollect;
    //     if (a == 1) {
    //         that.setData({
    //             mycollect: 0,
    //         });
    //         network.collect(12, id);
    //         wx.showToast({
    //             title: '取消收藏',
    //             icon: 'none',
    //         })
    //     } else {
    //         that.setData({
    //             mycollect: 1,
    //         });
    //         network.collect(12, id);
    //         wx.showToast({
    //             title: '您已收藏',
    //             icon: 'none',
    //         })
    //     }
    // },
    onShareAppMessage() {
        var that = this;
        return {
            title: that.data.detail.Name,
            path: '/pages/composition/compositionDetail/compositionDetail?id=' + id,
            success: function (res) {
                network.share(1, id);
            }
        };
    }

})