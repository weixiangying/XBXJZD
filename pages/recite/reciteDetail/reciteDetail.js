// pages/recite/reciteDetail/reciteDetail.js
var network = require("../../../utils/network.js");
const app = getApp();
var id = '';
Page({

  data: {
      scrollheight: '',
      topcurrent:0
  },

  onLoad: function (options) {
    //   id = options.id;
      id=1;
      var that=this;
      that.getDetail();
    //   app.systemInfo.windowWidth
    //   console.log(app.systemInfo.windowHeight)
        that.setData({
            scrollheight: app.systemInfo.windowHeight - app.systemInfo.windowWidth / 750 * 110 - app.systemInfo.windowHeight * 0.13,       
            
        });
         
      
  },
    intervalChange(e) {
        this.setData({
            interval: e.detail.value
        })
        console.log(bindchange)
    },
  onShow: function () {

  },
    getDetail() {
        var that = this;
        network.POST({
            url: 'v16/recite/section',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "ReciteId": id
            },
            success: function (res) {
                //   console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];

                    // 标题
                    var arrtitle = a.item.Name.split("");
                    var arrtitlepy = a.item.Section_py.split(" ");
                    arrtitle = arrtitle.map((key, value) => [key, arrtitlepy[value]]);
                    that.setData({
                        detail: res.data.data[0],
                        arrtitle: arrtitle,
                        list:a.list
                    });


                    var content='';
                    var contentpy = '';
                    for(var i=0;i<a.list.length;i++){
                         that.data.list[i].write=1;
                        var content = a.list[i].Section.split("");
                        var contentpy = a.list[i].Section_py.split(" ");
                        content = content.map((key, value) => [key, contentpy[value]]);
                        // console.log(content)
                        that.data.list[i].write = content
                    }
                    that.setData(that.data)
                    that.setData({                    
                        list: that.data.list
                    });
                    // console.log(that.data.list)
                    

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
    goBack: function () {
        wx.navigateBack({

        })
    },
    bindchange: function (e) {
        var that = this;
        // console.log(e.detail.current)
        that.setData({
            topcurrent: e.detail.current
        })
    },
    opened: function () {
        wx.showToast({
            title: '暂未开通',
            image: '../../../images/error.png',
            duration: 1000

        })
    },
})