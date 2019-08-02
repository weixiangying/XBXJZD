// pages/login/input_code/input_code.js
const network = require("../../../utils/network.js");
const app = getApp();
var c = 60;

Page({

  data: {
      
      display:false,
      error_tip:'验证码输入错误',

      code_isFocus: true,//控制input 聚焦
      code: [],
      length: 0,//已经输入的长度

      user_left_phone:'',
      verifyCodeTime: "60s后再次发送",
      verify_color: false,
     

  },
  onLoad: function (options) {
      var that = this; 
     
    //   console.log(options)
      that.setData({
          user_left_phone: options.user_left_phone
      })
  }, 
  onShow: function () {
      var that=this;
      that.setData({
          onshow:true
      })
      that.set_Focus();
      that.identify();
  },
    toAgrmt: function () {
        wx.navigateTo({
            url: '/pages/agremt/agremt'
        })
    },
    //验证码输入时获取验证码
    get_code:function(e) {
        var that = this;
        that.setData({
            code: e.detail.value
        });
        if (that.data.code.length == 0) {            
        }
        if (that.data.code.length == 1) {
            that.setData({
                length: e.detail.value.length,                
            });
        }
        if (that.data.code.length == 2) {
            that.setData({
                length: e.detail.value.length,                
            });
        }
        if (that.data.code.length == 3) {
            that.setData({
                length: e.detail.value.length,                
            });
        }
        if (that.data.code.length == 4) {
            that.setData({
                length: e.detail.value.length
            })          
        }
        if (that.data.code.length == 5) {
            that.setData({
                length: e.detail.value.length
            })
        }
        if (that.data.code.length == 6) {
            that.setData({
                length: e.detail.value.length
            })
            //请求登录
            that.get_login();
            // console.log('请求登录');

        }
    },
    //请求登录
    get_login:function(){
        var that=this;
        network.POST({
            url: 'v16/login/index',
            params: {
                "mobile": that.data.user_left_phone,
                "code": that.data.code
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '登录成功',
                        icon: 'none',
                        duration: 1000
                    });
                    var a = res.data.data[0].item;
                    wx.setStorage({
                        key: 'userInfo',
                        data: a
                    });
                    app.userInfo = a;   
                    
                    wx.switchTab({
                        url: '/pages/home/home'
                    })
                } else {
                    //登录失败提示,自定义样式
                    var newinterval=null;
                    var newinterval_time=5;
                    if (!that.data.display){
                        that.setData({
                            display: true,
                            error_tip: res.data.message,
                        })
                        newinterval = setInterval(function () {
                            newinterval_time--;                          
                            if (newinterval_time == 0) {
                                clearInterval(newinterval);
                                newinterval_time = 5;
                                that.setData({
                                    display: false,
                                })
                            }
                        }, 1000);
                    }
                    

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
        })
    },
    //聚焦input
    set_Focus() { 
        // console.log('set_Focus')
        var that = this;
        that.setData({
            code_isFocus: true
        })
    },
    
    //验证码
    identify:function(){
        var that=this;
        var intervalId = null;
        if (!that.data.verify_color) {
            that.setData({
                verify_color: true,
                
            });
            intervalId = setInterval(function () {
                c--;
                that.setData({
                    verifyCodeTime: c + 's后再次发送'
                })
                if (c == 0) {
                    clearInterval(intervalId);
                    c = 60;
                    that.setData({
                        verifyCodeTime: '获取验证码',
                        verify_color: false,
                        onshow: false
                    })
                   
                }
            }, 1000);
            if(!that.data.onshow){
                // console.log('send');               
                that.sendCode();
            }
            
            
            
        }
    },
    //发送验证码
    sendCode:function(){
        var that=this;
        network.POST({
            url: 'v4/login/sendcode',
            params: {
                "mobile": that.data.user_left_phone,
                "type": 1
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '发送成功',
                        duration: 1000
                    })
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
        })
    }  
})