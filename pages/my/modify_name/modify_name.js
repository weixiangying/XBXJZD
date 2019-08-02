const network = require("../../../utils/network.js");
const app = getApp();


Page({
    data: {
        newName: ''
    },
    onLoad: function(options){
      
    },
    inputFn: function (e) {
        var a = e.detail.value.replace(/^\s*|\s*$/, '');
        this.setData({
            newName: a
        });
    },
    valid: function(){
        var reg = /[\u4e00-\u9fa5a-zA-Z\d]{2,8}/;
        var a = this.data.newName;
        var flag = true;
        if(!a){
            
            wx.showToast({
              title: '请输入名字',
              image: '../../../images/error.png',
              duration: 1000
            });
            flag = false;
        }else if(!reg.test(a)){
            wx.showModal({
                title: '提示',
                content: '请输入2-8位的汉字、数字、字母'
            });
            flag = false;
        }else{
            flag = true;
        }
        return flag;
    },
    submitNewName: function(){
        var that = this;
        var flag = that.valid();
        if (flag){
            network.modifyPartInfo({ "nickname": that.data.newName }, function (res) {


                var b = wx.getStorageSync('userInfo');

                if (res.data.code == 200) {
                    b.nickname = app.userInfo.nickname = that.data.newName;
                    wx.setStorageSync('userInfo', b);
                    wx.navigateBack({
                        delta: 1
                    })
                }
            });
            // network.modifyPartInfo(that.data.newName, sexid, function(res){
            //     if (res.data.code == 200){
            //         var a = wx.getStorageSync('userInfo');
            //         a.nickname = app.userInfo.nickname = that.data.newName;
            //         wx.setStorageSync('userInfo', a);
            //         wx.navigateBack({
            //             delta: 1
            //         })
            //     }
            // });
        }
    }
})