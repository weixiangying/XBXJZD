var network = require("../../../utils/network.js");
const app = getApp();

Page({    
    data: {
        rightlist: '',
        currentleft: false,
        currentid: '',
        plateid: '',
        scrollTop: 0,  //用作跳转后右侧视图回到顶部
        classifyList: [],
       
        classifyid: '',
        classifytext: '',
        
    },

    onLoad: function (options) {
        var that = this;
        
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight - res.windowWidth / 750 * (133 ),
                    scrollHeight2: res.windowHeight - res.windowWidth / 750 * (133 )
                });
            }
        });
        that.getClassify();
        
    },
    //点击左侧
    left_choice: function (e) {
        var that = this;
        that.setData({
            currentid: e.currentTarget.dataset.leftid,
            mytext: e.currentTarget.dataset.classifytext,
        })
        // console.log(that.data.mytext)
        for (var i = 0; i < that.data.classifyList.length; i++) {
            if (e.currentTarget.dataset.leftid == that.data.classifyList[i].PrimaryID) {
                that.setData({
                    
                    listtwo: that.data.classifyList[i].listtwo,
                    
                })
            }
        }
        
    },
    getClassify: function () {
        var that = this;
        network.POST({
            url: 'v13/ncourse/category-all',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({                        
                        classifyList: a.list,
                        currentid: a.list[0].PrimaryID,
                        listtwo: a.list[0].listtwo,
                        mytext: a.list[0].TypeName
                    });
                 
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
    tz_page:function(e){
        var that=this;
        var leftid = that.data.currentid;
        var rightid = e.currentTarget.dataset.rightid;

       
        wx.navigateTo({
            url: '/pages/collegeNew/collegeNew?classifyid=' + leftid + '&rightid=' + rightid + '&mytext=' + that.data.mytext,
        })
    }
})