// pages/my/my_collect/my_collect.js
const network = require("../../../utils/network.js");
const app = getApp();
var page = 1;
var hasmore = '';

Page({

  data: {
      tabs: [{ index: 4, title: '课程', width: '50%' }, { index: 20, title: '话题', width: '50%' }],
      tabindex: 4, //4课程 20话题
      showEmpty: false,
      list: [],
      delBtnWidth: 60,
    //   list: [
    //       {
    //           "id": "112",
    //           "createTime": "4",
    //           "messageContent": "6",
    //           "imgurl": "../../../images/default_user.png",
    //           "title": "知之为知之，不知为不知",
    //           "fenlei": "",
    //           "likenum": "11",
    //           "commendnum": "8",
    //           "point": "0",
    //           "isxia": "1",
    //           "href": "http://m.doudou-le.com/news/detail?id=1&uid=58268&apptype=4"
    //       }, {
    //           "id": "112",
    //           "createTime": "4",
    //           "messageContent": "6",
    //           "imgurl": "../../../images/default_user.png",
    //           "title": "知之为知之，不知为不知",
    //           "fenlei": "",
    //           "likenum": "11",
    //           "commendnum": "8",
    //           "point": "0",
    //           "isxia": "1",
    //           "href": "http://m.doudou-le.com/news/detail?id=1&uid=58268&apptype=4"
    //       }
    //   ],
  },

  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
      this.empty = this.selectComponent("#empty");
  },
    onShow: function () {
        this.setData({
            tabindex: 4
        })
          this.getList(4, false);
    },
    swiTab(e) {
        var a = e.currentTarget.dataset.index;
        var that = this;
        page = 1;
        that.setData({
            tabindex: a
        });
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        that.getList(a, false);
    },
    getList(resourcetypeid, flag) {
        var that = this;
        network.POST({
            url: 'v14/news/collect-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "resourcetypeid": resourcetypeid,
                "page": page
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (flag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    hasmore = res.data.data[0].hasmore;



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
    onReachBottom: function () {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList(that.data.tabindex, true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
            }
        }
    },
    //手指刚放到屏幕触发
    touchS: function (e) {
        // console.log("touchS" + e);
        //判断是否只有一个触摸点
        if (e.touches.length == 1) {
            this.setData({
                //记录触摸起始位置的X坐标
                startX: e.touches[0].clientX
            });
        }
    },
    //触摸时触发，手指在屏幕上每移动一次，触发一次
    touchM: function (e) {
        // console.log("touchM:" + e);
        var that = this
        if (e.touches.length == 1) {
            //记录触摸点位置的X坐标
            var moveX = e.touches[0].clientX;
            //计算手指起始点的X坐标与当前触摸点的X坐标的差值
            var disX = that.data.startX - moveX;
            //delBtnWidth 为右侧按钮区域的宽度
            var delBtnWidth = that.data.delBtnWidth;
            var txtStyle = "";
            if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
                txtStyle = "left:0px";
            } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
                txtStyle = "left:-" + disX + "px";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-" + delBtnWidth + "px";
                }
            }
            //获取手指触摸的是哪一个item
            var index = e.currentTarget.dataset.index;
            var list = that.data.list;
            //将拼接好的样式设置到当前item中
            list[index].txtStyle = txtStyle;
            //更新列表的状态
            this.setData({
                list: list
            });
        }
    },
    touchE: function (e) {
        // console.log("touchE" + e);
        var that = this
        if (e.changedTouches.length == 1) {
            //手指移动结束后触摸点位置的X坐标
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = that.data.startX - endX;
            var delBtnWidth = that.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
            //获取手指触摸的是哪一项
            var index = e.currentTarget.dataset.index;
            var list = that.data.list;
            list[index].txtStyle = txtStyle;
            //更新列表的状态
            that.setData({
                list: list
            });
        }
    },
    del(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success(res) {
                if (res.confirm) {
                    that.sendDel({ '0': id });
                }
            }
        })
    },
    sendDel(obj) {
        var that = this;
        network.POST({
            url: 'v14/news/collect-del-all',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "collectid": JSON.stringify(obj)
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.getList(that.data.tabindex, false);
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
    //话题
    tz_detail: function (e) {
        wx.navigateTo({
            url: '/pages/topic/topic_vote/topic_vote?id=' + e.currentTarget.dataset.id,
        })
    },
    //跳转到课程详情
    tz_coursedetail: function (e) {
        wx.navigateTo({
            url: '/pages/course/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
        })
    },
})