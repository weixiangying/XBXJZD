// pages/topic/topic_vote/topic_vote.js
var network = require("../../../utils/network.js");
const app = getApp();
var id = '';
var page = 1;
var hasmore = '';
var optionid = '';
Page({

  data: {
      cssW:'',
      showEmpty: false,
      list: [],
      showbottom:true,
      iscollect: '',
      answerlist: [
        //   {
        //   "id": "1",
        //   "option": "A、呵呵呵",
        //   "percent": "57%",
        //   "checked": 0
        // },
        //   {
        //       "id": "3",
        //       "option": "B、飞飞飞33",
        //       "percent": "14%",
        //       "checked": 1
        //   },
        ]
  },
    onLoad: function (options) {
        var that = this;
        that.compontNavbar = that.selectComponent("#compontNavbar");
        that.empty = that.selectComponent("#empty");
        id = options.id;
        
    },
    selectClick: function (event){
        optionid=event.currentTarget.dataset.optionid;
        // console.log(optionid)
        for (var i = 0; i < this.data.answerlist.length; i++) {
            if (event.currentTarget.id == i) {
                this.data.answerlist[i].checked = 1
            }
            else {
                this.data.answerlist[i].checked = 0
            }

        }
        
        this.setData(this.data)
        this.setData({
            answerlist: this.data.answerlist,
            
        })
        
    },
    to_vote:function(){
        var that = this;
        // console.log(optionid)
        if (optionid==''){
            wx.showToast({
                title: "请选择选项",
                icon: 'none',
                duration: 1000
            });
        }
        else{
            network.POST({
                url: 'v14/news/vote-add',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "resourcetypeid": 21,
                    "resourceid": optionid,
                },
                success: function (res) {
                    // console.log(res);
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        wx.showToast({
                            title: '投票成功',
                            icon: 'none',
                            duration: 1000
                        });
                        that.getDetail();
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
        }
        
    },
  
    getDetail() {
        var that = this;
        network.POST({
            url: 'v16/topic/topic-detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "t_id": id
            },
            success: function (res) {
                  console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    for (var i = 0; i < a.answerList.length; i++) {
                        a.answerList[i].checked = 0;
                    }
                    that.setData({
                        detail: a,
                        answerlist: a.answerList,
                        iscollect: a.iscollect
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
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    getCommentList: function (contaFlag) {
        var that = this;
        network.POST({
            url: 'v14/news/comments-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "resourcetypeid": 20,
                "resourceid": id
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    if (contaFlag) {
                        a = that.data.commentlist.concat(a);
                    }
                    that.setData({
                        commentlist: a,
                        showEmptyComment: a.length == 0 ? true : false
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
        })
    },
    iscollect:function(){
        var that=this;
        network.collect(20, id, function (res) {
            // console.log(res);
            if (res.data.code == 200) {
                if (res.data.data[0].item.isdo == 1) {
                    that.setData({
                        iscollect: 1
                    });
                } else {
                    that.setData({
                        iscollect: 2
                    });
                }
            }
        });
    },
    onReachBottom: function () {
        var that = this;
        if (that.data.commentlist.length > 0) {
            if (hasmore) {
                page++;
                that.getCommentList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    },
  onShow: function () {
      var that=this;
      that.setData({
          cssW: app.systemInfo.windowWidth - app.systemInfo.windowWidth / 750 * 144
      })


      

      this.getDetail();
      that.getCommentList(false);
  },

//点击参与讨论
    discuss_btn: function () {
        this.setData({
            showbottom:false,
            mytype:1,
            mytypetext:'说点什么吧'
        })
        
    },
    bindtapall: function () {
        this.setData({
            showbottom: true,
           
        })

    },
    inputFn: function (e) {
        this.setData({
            msg: e.detail.value.replace(/^\s*|\s*$/, '')
        });
    },
    submitCommt: function () {
        var that = this;
        var a = that.data.msg;
        if (a) {
            if(that.data.mytype==2){
                that.submittypetwo(a);
            }
            else{
                network.POST({
                    url: 'v14/news/comments-add',
                    params: {
                        "mobile": app.userInfo.mobile,
                        "token": app.userInfo.token,
                        "resourcetypeid": 20,
                        "resourceid": id,
                        "content": a,
                    },
                    success: function (res) {

                        wx.hideLoading();
                        if (res.data.code == 200) {
                            // that.getCommentList(); 
                            wx.showToast({
                                title: '操作成功'
                            });
                            
                            page = 1;
                            hasmore = '';
                            that.getCommentList(false);
                            that.setData({
                                msg: '',
                                showbottom: true
                            })
                        } else {
                            wx.showToast({
                                title: res.data.message,
                                icon: 'none',
                                duration: 1000
                            })
                            that.setData({
                                msg: ''
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
            }
        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请输入内容'
            });
        }
    },
    submittypetwo:function(a){
        var that = this;
        network.POST({
            url: 'v14/news/comments-add',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "resourcetypeid":20,
                "resourceid": id,
                "content": a,
                "parent": that.data.parent,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                wx.showToast({
                    title: res.data.message
                });
                var timer=setInterval(function(){
                    that.getCommentList(false);
                    that.setData({
                        msg: '',
                        showbottom: true
                    })
                    clearInterval(timer)
                },1000)
                
                
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
    //评论中的点赞
    comment_zan: function (e) {
        var that = this;
        // console.log(e.currentTarget.dataset.dianzancomment)
        if (e.currentTarget.dataset.dianzancomment == 1) {
            wx.showToast({
                title: '您已点赞',
                icon: 'none',
                duration: 1000
            });
        }
        else {
            for (var i = 0; i < that.data.commentlist.length; i++) {
                if (that.data.commentlist[i].id == e.currentTarget.dataset.commentid) {
                    var commentlist2 = that.data.commentlist
                    commentlist2[i].agreenum = Number(parseInt(that.data.commentlist[i].agreenum) + 1)
                    commentlist2[i].isagree = 1;
                    that.setData({
                        commentlist: commentlist2
                    })
                }
            }
            network.addAgree(10, e.currentTarget.dataset.commentid);
        }
    },
    comment_reply:function(e){
        this.setData({
            showbottom:false,
            mytype:2,
            mytypetext:'回复...',
            parent: e.currentTarget.dataset.commentid
        })
    },
    onShareAppMessage() {
        var that = this;
        return {
            title: that.data.detail.title,
            path: '/pages/topic/topic_vote/topic_vote?id=' + that.data.detail.id,
            success: function (res) {
                network.share(20, that.data.detail.id);
            }
        };
    }
})