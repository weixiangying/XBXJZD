var network = require("../../../utils/network.js");
const wxParse = require('../../../wxParse/wxParse.js');
const app = getApp();
var page = 1;
var hasmore = null;
var courseid = '';
var videopic = '';
Page({
    data: {
        base: '../../../',
        curTabIndex: 0,
        isShowDialog: false,
        animationData: null,
        msg: '',
        showEmpty: false,
        showEmptyComment: false,
        detail: '',
        isLike: false,
        zhedie:0,
        bjdetail: 1,
        flag: true,
        realuserid: '',//用户自己的id
        notetail: '',//笔记内容
        pldetail: 1,
        twdetail: 1,
        ansContentList: [],
        scrollheight:''
    },
    tabFun: function (e) {
        page = 1;
        hasmore = '';
        this.setData({
            curTabIndex: e.currentTarget.dataset.id
        });
        this.getAll();
    },
    getAll:function(){
      var that = this;
      if (that.data.curTabIndex == 0) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        });
        page = 1;
        hasmore = '';
        that.getDetail();
        that.getJjcourse();
      }
      else if (that.data.curTabIndex == 1) {
        // console.log('111')
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        });
        page = 1;
        hasmore = '';
          that.getTwList(false);
        
      }
      else if (that.data.curTabIndex == 2) {
        // console.log('222')
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        });
        page = 1;
        hasmore = '';
        that.getCommentList(false);
        
      }
      else if (that.data.curTabIndex == 3) {
        // console.log('333')
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        });
        page = 1;
        hasmore = '';
        that.getNoteList(false);
      }
    },
    onLoad: function (options) {
        var that = this;       
       
        videopic = options.videopic;
        courseid = options.courseid;
        that.empty = that.selectComponent("#empty");
        that.setData({
          videopic: videopic
        })
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              scrollheight: res.windowHeight - res.windowWidth / 750 * 546 - res.windowHeight*0.1,    //改前456   
              tab_topstyle: res.windowHeight * 0.1+  res.windowWidth / 750 * 450      
            });
          }
        });
    },
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v13/ncourse/course-info',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "courseid": courseid
            },
            success: function (res) {
                // console.log(res.data.data[0].item);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        detail: res.data.data[0].item,
                        detail_iscollect: res.data.data[0].item.iscollect,
                        detail_collect_num: res.data.data[0].item.collect_num,
                        detail_isagree: res.data.data[0].item.isagree,
                        detail_agreeNum: res.data.data[0].item.AgreeNum,
                        detail_share_num: res.data.data[0].item.share_num,
                        
                    });

                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: none,
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
    getJjcourse: function () {
      var that = this;
      network.POST({
        url: 'v13/ncourse/course-list',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "tag_courseid": courseid,
        },
        success: function (res) {
          // console.log(res.data.data[0].item);
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              jj_course: res.data.data[0].list,              
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
      })
    },
    onShow: function () {
        var that = this;
        that.setData({
          realuserid:app.userInfo.id,
          flag: true
        })
        // console.log(that.data.realuserid)
        that.getAll(); 
    },
    getTwList: function (contaFlag) {
      var that = this;
      network.POST({
        url: 'v14/question/list',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "page": page,
          "type": 2,
          "resourcetypeid": 4,
          "resourceid": courseid
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            var a = res.data.data[0].list;
            if (contaFlag) {
              a = that.data.twlist.concat(a);
            }
            that.setData({
              twlist: a,
              showEmptyTw: a.length == 0 ? true : false
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
    getCommentList: function (contaFlag) {
        var that = this;
        network.POST({
            url: 'v14/news/comments-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "resourcetypeid": 4,
                "resourceid": courseid
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
    getCommentListDetail: function (contaFlag) {
      var that = this;
      network.POST({
        url: 'v14/news/comments-detail',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "page": page,
          "id": parseInt(that.data.commentdetailid),         
        },
        success: function (res) {
        //   console.log(res)
          // console.log(res.data.data[0].item);
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              commentdetail: res.data.data[0].item,
              commentdetailreply: res.data.data[0].item.reply_list,                
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
      })
    },
    //提问详情
    getQuesDetail: function () {
      var that = this;
      
        network.POST({
          url: 'v14/question/detail',
          params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "id": that.data.twdetailid
          },
          success: function (res) {
            // console.log(res.data.data[0].item);
            wx.hideLoading();
            if (res.data.code == 200) {
              that.setData({
                twcontentdetail: res.data.data[0].item,
                twcontentdetail_answernum: res.data.data[0].item.answernum,
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
    getAnsList: function (flag) {
      var that = this;
     
        network.POST({
          url: 'v14/question/answer-list',
          params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "questionid": that.data.twdetailid,
            "page": page
          },
          success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
              var a = res.data.data[0].list;
              if (flag) {
                a = that.data.ansList.concat(a);
              }

              for (let i = 0; i < a.length; i++) {
                wxParse.wxParse('content' + i, 'html', a[i].content, that);
                if (i === a.length - 1) {
                  wxParse.wxParseTemArray("ansContentList", 'content', a.length, that);
                }
              };

              that.setData({
                ansList: a,
                // showEmpty: a.length == 0 ? true : false
              });
              hasmore = res.data.data[0].hasmore;
              // console.log(a);
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
    getNoteList: function (contaFlag) {
      var that = this;
      network.POST({
        url: 'v14/news/comments-list',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "page": page,
          "resourcetypeid": 13,
          "resourceid": courseid
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            var a = res.data.data[0].list;
            if (contaFlag) {
              a = that.data.notelist.concat(a);
            }
            that.setData({
              notelist: a,
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
      })
    },
    // onReachBottom
    loadMore: function () {
        var that = this;
        if (that.data.curTabIndex==0){
          //简介
        }
        else if ((that.data.curTabIndex == 1) && (that.data.pldetail == 1)) {
          //提问
          if (that.data.twlist.length > 0) {
            if (hasmore) {
              page++;
              that.getTwList(true);
            } else {
              wx.showToast({
                title: '没有更多了',
                  icon: 'none',
                duration: 1000
              });
            }
          }
        }
        else if ((that.data.curTabIndex == 1) && (that.data.pldetail == 2)) {
          //提问详情中的回答
          if (that.data.ansList.length > 0) {
            if (hasmore) {
              page++;
              that.getAnsList(true);
            } else {
              wx.showToast({
                title: '没有更多了',
                  icon: 'none',
                duration: 1000
              })
            }
          }
        }
        else if ((that.data.curTabIndex == 2)&& (that.data.pldetail == 1)) {
          //评论
          if (that.data.commentlist.length > 0){
            if (hasmore) {
                page++;
                that.getCommentList(true);
            } else  {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
          }
        }
        
        else if ((that.data.curTabIndex == 3) && (that.data.bjdetail==1)) {
          //笔记
          if(that.data.notelist.length > 0){
            if (hasmore) {
              page++;
              that.getNoteList(true);
            } else {
              wx.showToast({
                title: '没有更多了',
                  icon: 'none',
                duration: 1000
              });
            }
          }
        }
        // if (that.data.commentlist.length > 0){
        //     if (hasmore) {
        //         page++;
        //         that.getCommentList(true);
        //     } else  {
        //         wx.showToast({
        //             title: '没有更多了',
        //            icon: 'none',
        //             duration: 1000
        //         });
        //     }
        // }
    },
    //点赞
    iflike: function () {
        var that = this;
        that.setData({
            isLike: true
        });

        network.addAgree(4, courseid);
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
            network.POST({
                url: 'v14/news/comments-add',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "resourcetypeid": 4,
                    "resourceid": courseid,
                    "content": a,                   
                },
                success: function (res) {
                   
                    wx.hideLoading();                    
                    if (res.data.code == 200) {
                        // that.getCommentList(); 
                      wx.showToast({
                        title: '操作成功'
                      });   
                      wx.pageScrollTo({
                        scrollTop: 0,
                        duration: 0
                      });
                      page = 1;
                      hasmore = '';                     
                      that.getCommentList(false); 
                      that.setData({
                        msg:''
                      })                                         
                    }else{
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

        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请输入内容'
            });
        }
    },
    
    
    onUnload: function(){
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false,
            showEmptyComment: false,
            msg: ''
        });
    },
    // 文字折叠
    zhedie: function (e) {
      // console.log(e)
      var that = this;
      var zhedie = Number(that.data.zhedie) + 1;
      that.setData({
        zhedie: zhedie,
      })
    },
    //点击笔记
    tz_bjdetail: function (e) {
      var that = this;
      that.setData({
        bjdetail: 2,
        notetail: e.currentTarget.dataset.notetail
      })
    },
    bjdetail_close: function () {
      var that = this;
      that.setData({
        bjdetail: 1
      })
    },
    //点击评论
    tz_pldetail: function (e) {
      var that = this;
      that.setData({
        pldetail: 2,
        commentdetailid: e.currentTarget.dataset.commentdetailid
      })
      that.getCommentListDetail(false);
    },
    pldetail_close: function () {
      var that = this;
      that.setData({
        pldetail: 1
      })
    },
    //点击提问
    tz_twdetail: function (e) {
      var that = this;
      that.setData({
        twdetail: 2,
        twdetailid: e.currentTarget.dataset.twdetailid
      })
      that.getQuesDetail();
      that.getAnsList(false);
    },
    twdetail_close: function () {
      var that = this;
      that.setData({
        twdetail: 1
      })
    },
    jj_add: function () {
      this.setData({ flag: false })
    },
    mask_del: function () {
      this.setData({ flag: true })
    },
    tz_write: function (e) {
      wx.navigateTo({        
        url: '/pages/course/write/write?mytag=' + e.currentTarget.dataset.mytag + '&courseid=' + courseid + '&parent=' + e.currentTarget.dataset.parent,
      })
    },
    // 简介中收藏
    collect:function(e){
      var that=this;
      // console.log(that.data.detail_iscollect)
      
      if (that.data.detail_iscollect== 1) {
        // 已收藏状态，取消收藏
        network.POST({
          url: 'v14/news/collect-add',
          params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "resourcetypeid": 4,
            "resourceid": courseid
          },
          success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
              wx.showToast({
                title: '取消收藏',
                  icon: 'none',
              })
              that.setData({
                detail_iscollect: 2,
                detail_collect_num: Number(parseInt(that.data.detail_collect_num) - 1),
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
      }
      else if (that.data.detail_iscollect == 2) {
        // 将要收藏
        network.POST({
          url: 'v14/news/collect-add',
          params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "resourcetypeid": 4,
            "resourceid": courseid
          },
          success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
              wx.showToast({
                title: '收藏成功',
              })
              that.setData({
                detail_iscollect: 1,
                detail_collect_num: Number(parseInt(that.data.detail_collect_num) + 1),
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
      }
    },
    // 简介中 点赞
    addAgree: function (e) {
      var that = this;
      if (that.data.detail_isagree == 1) {
        wx.showToast({
          title: '您已点赞',
            icon: 'none',
          duration: 1000
        });
      }
      else {
        that.setData({
            detail_isagree: 1,
            detail_agreeNum: Number(parseInt(that.data.detail_agreeNum) + 1),
        });
        network.addAgree(4, courseid);
      }
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
    //评论中删除我的评论
    del_mycomment:function(e){
      var that=this;
      wx.showModal({
        title: '提示',
        content: '是否删除该评论？',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            network.POST({
              url: 'v14/news/comments-delete',
              params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": e.currentTarget.dataset.commentid,
              },
              success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                  for (var i = 0; i < that.data.commentlist.length; i++) {
                    if (that.data.commentlist[i].id == e.currentTarget.dataset.commentid) {
                      var commentlist2 = that.data.commentlist
                      commentlist2.splice(i, 1)
                      that.setData({
                        commentlist: commentlist2
                      })
                    }
                  }
                  wx.showToast({
                    title: '已删除该评论',
                      icon: 'none',
                  })
                } else {
                  wx.showToast({
                    title: res.data.message,
                      icon: none,
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
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      
    },
    //评论详情中删除我的评论
    del_mycomment_detail: function (e) {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '提示是否删除该评论？',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            network.POST({
              url: 'v14/news/comments-delete',
              params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": e.currentTarget.dataset.commentid,
              },
              success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                  that.getCommentListDetail(false)
                  wx.showToast({
                    title: '已删除该评论',
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
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })

    },
    comment_zan1: function (e) {
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
        var commentlist2 = that.data.commentdetail
          commentlist2.agreenum = Number(parseInt(that.data.commentdetail.agreenum) + 1)
          commentlist2.isagree = 1;
          that.setData({
              commentdetail: commentlist2
          })
        network.addAgree(10, e.currentTarget.dataset.commentid);
      }


    },
    //评论详情中的点赞
    comment_zan_detail: function (e) {
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
          for (var i = 0; i < that.data.commentdetailreply.length; i++) {
              if (that.data.commentdetailreply[i].id == e.currentTarget.dataset.commentid) {
                  var commentlist2 = that.data.commentdetailreply
                  commentlist2[i].agreenum = Number(parseInt(that.data.commentdetailreply[i].agreenum) + 1)
                  commentlist2[i].isagree = 1;
                  that.setData({
                      commentdetailreply: commentlist2
                  })
              }
          }
        network.addAgree(10, e.currentTarget.dataset.commentid);
      }


    },
    //提问详情中的点赞
    tw_zan_detail: function (e) {
      var that = this;
      // console.log(e.currentTarget.dataset.dianzancomment)
      if (e.currentTarget.dataset.dianzantw == 1) {
        wx.showToast({
          title: '您已点赞',
            icon: 'none',
          duration: 1000
        });
      }
      else {
          for (var i = 0; i < that.data.ansList.length; i++) {
              if (that.data.ansList[i].id == e.currentTarget.dataset.twid) {
                  var ansList2 = that.data.ansList
                  ansList2[i].agreenum = Number(parseInt(that.data.ansList[i].agreenum) + 1)
                  ansList2[i].isagree = 1;
                  that.setData({
                      ansList: ansList2
                  })
              }
          }

          network.addAgree(9, e.currentTarget.dataset.twid);
      }


    },
    //提问中删除我的提问
    del_mytw:function(e){
      var that = this;
      wx.showModal({
        title: '提示',
        content: '提示是否删除该提问？',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            network.POST({
              url: 'v14/question/delete',
              params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": e.currentTarget.dataset.twid,
              },
              success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                  for (var i = 0; i < that.data.twlist.length; i++) {
                    if (that.data.twlist[i].id == e.currentTarget.dataset.twid) {
                      var twlist2 = that.data.twlist
                      twlist2.splice(i, 1)
                      that.setData({
                        twlist: twlist2
                      })
                    }
                  }
                  wx.showToast({
                    title: '已删除该提问',
                      icon: 'none'
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
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    },
    //提问中删除我的回答
    del_myanswer_detail: function (e) {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '提示是否删除该回答？',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            network.POST({
              url: 'v14/question/answer-delete',
              params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "id": e.currentTarget.dataset.answerid,
              },
              success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                  for (var i = 0; i < that.data.ansList.length; i++) {
                    if (that.data.ansList[i].id == e.currentTarget.dataset.answerid) {
                      var ansList2 = that.data.ansList
                      ansList2.splice(i, 1)
                      that.setData({
                        ansList: ansList2,
                        twcontentdetail_answernum: Number(that.data.twcontentdetail_answernum)-1
                      })
                    }
                  }
                  wx.showToast({
                    title: '已删除该回答',
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
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    },
    //提问详情中跳转回答问题
    tz_answerquestion:function(e){
      var that=this;
    //   wx.navigateTo({
    //     url: '/pages/home/pages/homework/answer/answer?id=' + e.currentTarget.dataset.answerid + '&title=' + e.currentTarget.dataset.answertitle,
    //   })
    },
    // 分享
    onShareAppMessage() {
      var that = this;
        // console.log(that.data.detail);
      return {
        title: that.data.detail.name,
        path: '/pages/course/courseDetail/courseDetail?courseid=' + courseid + '&videopic=' + that.data.videopic,
          imageUrl: that.data.detail.PicUrl,
        success: function (res) {
            that.setData({
                detail_share_num: Number(parseInt(that.data.detail_share_num) + 1)
            });
          network.share(4, courseid);
        }
      };
    },
    //点击简介中的其他课
    tz_detail: function (e) {
      // console.log(e.currentTarget.dataset)  
      wx.navigateTo({
        url: '/pages/course/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
      })
    },
})