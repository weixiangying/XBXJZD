// pages/binding/form/form.js
var network = require("../../../utils/network.js");
var md5 = require("../../../utils/md5.js");
const app = getApp();
var regMobile = /^1(3|4|5|7|8)\d{9}$/;
var regPassw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
var c = 60;
var mytype=0;

Page({

  data: {
      mytype:1,

      verifyCodeTime: "获取验证码",
      verify_color: false,
      mobile: '',
      phone: '',
      vcode: '',
      password: '',
  },

  
  onLoad: function (options) {
      mytype = options.mytype;
      this.setData({
          mytype: options.mytype,
          idname:app.idname
      })
  },
    //手机号
    phoneInputEvent: function (e) {
        this.setData({
            mobile: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //验证码
    vcodeInputEvent: function (e) {
        this.setData({
            vcode: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //密码
    passwordInputEvent: function (e) {
        this.setData({
            password: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    //验证码
    identify: function (e) {
        var that = this;
        if (!that.data.verify_color) {
            var mobile = that.data.mobile;
            var intervalId = null;
            if (!regMobile.test(mobile)) {
                wx.showToast({
                    title: '手机号不合法',
                    image: '../../../images/error.png',
                    duration: 1000
                })
            }
            else {
                that.setData({
                    verify_color: true
                });
                intervalId = setInterval(function () {
                    c--;
                    that.setData({
                        verifyCodeTime: c + 's后重发'
                    })
                    if (c == 0) {
                        clearInterval(intervalId);
                        c = 60;
                        that.setData({
                            verifyCodeTime: '获取验证码',
                            verify_color: false
                        })
                    }
                }, 1000);

                that.sendCode(mobile);

            }
        }
    },
    sendCode: function (mobile) {
        network.POST({
            url: 'v4/login/sendcode',
            params: {
                "mobile": mobile,
                "type": 3
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
    },
    //点击确定
    submit: function (e) {
        var that = this;
        // 手机号
        var mobile = that.data.mobile;
        // 验证码
        var vcode = that.data.vcode;
        // 密码
        var password = that.data.password;
        
        if (!regMobile.test(mobile)) {
            wx.showToast({
                title: '手机号不合法',
                image: '../../../images/error.png',
                duration: 1000
            })
        }
        else if (vcode.length == 0) {
            wx.showToast({
                title: '请输入验证码',
                image: '../../../images/error.png',
                duration: 1000
            })
        }
        else if (password.length == 0) {
            wx.showToast({
                title: '请输入密码',
                image: '../../../images/error.png',
                duration: 1000
            })
        }
        else if (!regPassw.test(password)) {
            wx.showModal({
                title: '提示',
                content: '密码6-18位，包含至少一个字母和一个数字',
                showCancel: false
            })
        }
        else {
            // console.log('添加')
            network.POST({
                url: 'v16/user-bind/register',
                params: {
                    'mobile': app.userInfo.mobile,
                    'token': app.userInfo.token,
                    'user_mobile': mobile,
                    'user_password': md5.hexMD5(password),    
                    'user_code':vcode
                },
                success: function (res) {
                    wx.hideLoading();
                    // console.log(res);
                    if (res.data.code == 200) {
                        var a = res.data.data[0].item;
                        // console.log(a)
                        wx.showToast({
                            title: '添加成功',
                            duration: 1000,
                            success: function () {                               
                               
                                wx.navigateTo({
                                    url: '/pages/binding/archives/archives?uid=' + a.uid + '&umobile=' + a.umobile + '&password=' + password,
                                })
                            }
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

    },
    submitbottom:function(){
        var that = this;
        // 手机号
        var mobile = that.data.mobile;
        // 密码
        var password = that.data.password;

        if (!regMobile.test(mobile)) {
            wx.showToast({
                title: '手机号不合法',
                image: '../../../images/error.png',
                duration: 1000
            })
        }
        
        else if (password.length == 0) {
            wx.showToast({
                title: '请输入密码',
                image: '../../../images/error.png',
                duration: 1000
            })
        }
        else{
            that.getCheck(mobile, password);
            
        }
    },
    getCheck: function (mobile,password){
        var that=this;
        network.POST({
            url: 'v16/user-bind/check',
            params: {
                'mobile': app.userInfo.mobile,
                'token': app.userInfo.token,
                'user_mobile': mobile,
                'code': md5.hexMD5(password)
            },
            success: function (res) {
                wx.hideLoading();
                // console.log(res);
                if (res.data.code == 200) {
                    
                    var a = res.data.data[0].item;
                    if (a.is_need_do==1){
                        wx.navigateTo({
                            url: '/pages/binding/archives/archives?uid=' + a.uid + '&umobile=' + a.umobile + '&password=' + password,
                        })
                       
                    }
                    else if (a.is_need_do == 2){
                        network.POST({
                            url: 'v16/user-bind/save',
                            params: {
                                'mobile': app.userInfo.mobile,
                                'token': app.userInfo.token,
                                'user_mobile': mobile,
                                'code': md5.hexMD5(password),
                            },
                            success: function (res) {
                                wx.hideLoading();
                                // console.log(res);
                                if (res.data.code == 200) {
                                    wx.showToast({
                                        title: '添加成功',
                                        duration: 1000,
                                        success: function () {

                                            wx.switchTab({
                                                url: '/pages/home/home',
                                            })
                                        }
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