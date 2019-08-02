// pages/my/advise/advise.js
const network = require("../../../utils/network.js");
const app = getApp();
var regMobile = /^1(3|4|5|7|8)\d{9}$/;


Page({
    data: {
        content: '',
        mobile: ''
    },
    onLoad() {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    saveContent(e) {
        this.setData({
            content: e.detail.value.replace(/^\s*|\s*$/, '')
        });
    },
    saveMobile: function (e) {
        this.setData({
            mobile: e.detail.value.replace(/^\s*|\s*$/, '')
        })
    },
    submit() {
        var that = this;
        var content = that.data.content;
        var mobile = that.data.mobile;
        if (!content) {
            wx.showToast({
                title: '请输入内容',
                icon: 'none',
                duration: 1000
            })
        }
        else if (mobile && !regMobile.test(mobile)) {
            wx.showToast({
                title: '手机号不合法',
                icon: 'none',
                duration: 1000
            })
        }
        else {
            network.POST({
                url: 'v12/suggest/index',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "content": content,
                    "contract_mobile": mobile
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '提交成功,感谢您的反馈',
                            success: function () {
                                wx.navigateBack({
                                    
                                })
                            }
                        });
                    } else {
                        wx.showToast({
                            title: res.data.message,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                },
                fail: function () {
                    wx.showToast({
                        title: '服务器异常',
                        icon: 'none',
                        duration: 1000
                    })
                }
            });
        }
    }
})