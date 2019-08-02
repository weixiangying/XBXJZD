const network = require("../../utils/network.js");
var md5 = require("../../utils/md5.js");
var app = getApp();

Page({

  data: {
      menu_content_left:true,
      menu_content_right: false,
      passwordimg:'../../images/see_off.png',
      passwordtype:'password',

      user_left_phone:'',
      user_right_phone: '',
      user_right_password: '',
  },
  onLoad: function (options) {
      network.getAllAdress();
      this.setData({
        version: app.version,
        idname:app.idname
      })
  },
  onShow: function () {

  },
  //输入左侧的电话
    user_left_phone: function (e) {
        this.setData({
            user_left_phone: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //点击左侧的登录
    click_left_login: function (e) {
        var that=this;
        var user_left_phone = that.data.user_left_phone;
        if (user_left_phone.length == 0 ) {
            wx.showToast({
                title: '手机号不能为空',
                image: '../../images/error.png',
                duration: 1000
            })
        }
        else if (!(/^1(3|4|5|7|8)\d{9}$/.test(user_left_phone))) {
            wx.showToast({
                title: '手机号不合法',
                image: '../../images/error.png',
                duration: 1000
            })
        }
        else{
            //发送验证码，成功后跳转
            that.sendCode(user_left_phone);    
            // wx.navigateTo({
            //     url: '/pages/login/input_code/input_code?user_left_phone=' + that.data.user_left_phone
            // })        
        }
    },
    sendCode: function (mobile) { 
        // console.log(mobile)      
        network.POST({
            url: 'v4/login/sendcode',
            params: {
                "mobile": mobile,
                "type": 1
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: '发送成功',
                        icon: 'none',
                        duration: 1000
                    });
                    wx.navigateTo({
                        url: '/pages/login/input_code/input_code?user_left_phone=' + mobile
                    })
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
        })
    },

    //输入右侧的电话
    user_right_phone: function (e) {
        this.setData({
            user_right_phone: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //输入右侧的密码
    user_right_password: function (e) {
        this.setData({
            user_right_password: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //点击右侧的登录
    click_right_login: function (e) {
        var that = this;
        var user_right_phone = that.data.user_right_phone;
        var user_right_password = that.data.user_right_password;
        if (user_right_phone.length == 0 || user_right_password.length == 0) {
            wx.showToast({
                title: '不能为空',
                image: '../../images/error.png',
                duration: 1000
            })
        }
        else if (!(/^1(3|4|5|7|8)\d{9}$/.test(user_right_phone))) {
            wx.showToast({
                title: '手机号不合法',
                image: '../../images/error.png',
                duration: 1000
            })
        }
        else {
            // console.log('右侧请求')
            network.POST({
                url: 'v16/login/index',
                params: {
                    "mobile": user_right_phone,
                    "password": md5.hexMD5(user_right_password)
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        var a = res.data.data[0].item;
                        // console.log(a) 
                        wx.setStorage({
                            key: 'userInfo',
                            data: a
                        });
                        app.userInfo = a; 
                        // console.log(app.userInfo)   
                        // console.log(wx.getStorageSync('userInfo'))                   
                        wx.switchTab({
                            url: '/pages/home/home'
                        })
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
            })
        }
    },
  //点击切换
    tab_topbox_left: function () {
        var that=this;
        that.setData({
            menu_content_left:true,
            menu_content_right: false,
        })
    },
    tab_topbox_right: function () {
        var that = this;
        that.setData({
            menu_content_left: false,
            menu_content_right: true,
        })
    },
    
    //点击密码图片
    passwordimg:function(){
        var that = this;
        if(that.data.passwordtype=='password'){
            that.setData({
                passwordimg: '../../images/see_on.png',
                passwordtype: 'text',
            })
        }
        else{
            that.setData({
                passwordimg: '../../images/see_off.png',
                passwordtype: 'password',
            })
        }
    }
})