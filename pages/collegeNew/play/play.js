// pages/collegeNew/play/play.js

var network = require("../../../utils/network.js");
const app = getApp();
var myid = '';
var playid = '';
var playsrc='';
var topimg='';

var playtitle='';
var playauthor = '';



const bgMusic = wx.getBackgroundAudioManager()

Page({
    data: {
        playicon: '../../../images/college/play_video.png',
        playicontype: 1,
        isOpen: false,//播放开关
        starttime: '00:00', //正在播放时长
        duration: '',   //总时长
        src: ""
    },
    onLoad: function (options) {
        myid = options.myid;
        playid = options.playid;
        playsrc = options.playsrc;
        // myid = 1328;
        // playid = options.playid;
        // playsrc = options.playsrc;
        topimg = options.topimg;
        var that = this;
        
        if (topimg){
            that.setData({
                topimg:topimg
            })
        }
        else{
            that.setData({
                topimg: '../../../images/normal_pic1.png'
            })
        }
        if (playauthor) {
            
            playauthor= options.playauthor
            
        }
        else {
            
            playauthor = app.idname
           
        }
        
        
        that.getList();

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollheight: res.windowHeight - res.windowWidth / 750 * 560 - res.windowHeight * 0.1,
                    playsrc: playsrc,
                    filetype: options.filetype
                });
            }
        });
        if (options.filetype==1){
            that.setData({
                playicon: '../../../images/college/play_video.png',
                playicontype:1
            })
        }
        else{
            that.setData({
                playicon: '../../../images/college/play_s.gif',
                playicontype: 2
            })
        }
        
    },

    onShow: function () {

    },
    tz_play:function(e){
        var that=this;
        playid = e.currentTarget.dataset.playid;
        playsrc = e.currentTarget.dataset.playsrc;
        that.setData({
            playsrc: playsrc,
            playid: playid,
            currentplayid: playid,

            isOpen: false,//播放开关
            starttime: '00:00', //正在播放时长
            duration: '',   //总时长
            src: "",
            offset: 0,
            max: 0,
        })
        
        bgMusic.seek(0);
        that.listenerButtonPause();
        // bgMusic.currentTime=0;
        // bgMusic.onEnded(() => {
        //     that.setData({
        //         starttime: '00:00',
        //         isOpen: false,
        //         offset: 0
        //     })
        //     console.log("音乐播放结束");
        // })
        
        that.getList();
    },
    video_leftimg:function(e){
        var that=this;
        
        var direction = e.currentTarget.dataset.direction;
        console.log(direction)

        var myindex='';
        for (var i = 0; i < that.data.list.length; i++){
            if (playid == that.data.list[i].fileid) {
                myindex = that.data.list[i].myindex;
            }
        }
        // myindex = myindex - 1;
        if (direction == 1) {
            myindex = Number(myindex) - 1;
            if (myindex <2) {
                myindex = 1;
            }
        }
        else{
            myindex = Number(myindex) + 1;
            if (myindex > that.data.list.length) {
                myindex = that.data.list.length;
            }
        }
        
        
        myindex = Number(myindex) < 10 ? ('0' + myindex) : myindex;

        // console.log(myindex)

        var newplayid='';
        var newplaysrc='';
        for (var i = 0; i < that.data.list.length; i++) {
            if (myindex == that.data.list[i].myindex) {
                
                newplayid = that.data.list[i].fileid;
                newplaysrc = that.data.list[i].fileurl;
                // console.log(newplayid)
            }
        }
        // console.log(newplayid)
        playid = newplayid;
        playsrc = newplaysrc;
        
        that.setData({
            playsrc: playsrc,
            playid: playid,
            currentplayid: playid,

            isOpen: false,//播放开关
            starttime: '00:00', //正在播放时长
            duration: '',   //总时长
            src: "",
            offset: 0,
            max: 0,
        })
        
        bgMusic.seek(0);
        that.listenerButtonPause();

        that.getList();
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v13/ncourse/tan-file-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "lessonid": myid,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    that.setData({
                        list: a,
                        showEmpty: a.length == 0 ? true : false
                    });
                    for (var i = 0; i < that.data.list.length; i++) {
                        // this.data.answerlist[i].checked = 1
                        that.data.list[i].myindex = Number(i + 1) < 10 ? ('0' + (i + 1)) : i + 1;
                    }
                    that.setData({
                        list: that.data.list
                    })
                    for (var i = 0; i < that.data.list.length; i++) {
                        if (that.data.list[i].fileid == playid){
                            that.setData({
                                currentplayid: playid,
                                duration: that.data.list[i].filetime,
                                src: that.data.list[i].fileurl,
                                starttime:'00:00',
                                offset: 0,
                                max: 0,
                            })
                            playtitle = that.data.list[i].filename;
                        }
                    }
                    that.listenerButtonPlay();
                    
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

    // 播放
    listenerButtonPlay: function () {
        var that = this
        //bug ios 播放时必须加title 不然会报错导致音乐不播放
        bgMusic.title = playtitle;
        bgMusic.epname = playauthor;
        bgMusic.src = that.data.src;
        bgMusic.onTimeUpdate(() => {
            //bgMusic.duration总时长  bgMusic.currentTime当前进度
            // console.log(bgMusic.currentTime)
            var duration = bgMusic.duration;
            var offset = bgMusic.currentTime;
            var currentTime = parseInt(bgMusic.currentTime);
            var min = "0" + parseInt(currentTime / 60);
            var max = parseInt(bgMusic.duration);
            var sec = currentTime % 60;
            if (sec < 10) {
                sec = "0" + sec;
            };
            var starttime = min + ':' + sec;   /*  00:00  */
            that.setData({
                offset: currentTime,
                starttime: starttime,
                max: max,
                changePlay: true
            })
        })
        //播放结束
        bgMusic.onEnded(() => {
            that.setData({
                starttime: '00:00',
                isOpen: false,
                offset: 0
            })
            console.log("音乐播放结束");
        })
        bgMusic.play();
        that.setData({
            isOpen: true,
        })
    },
    //暂停播放
    listenerButtonPause() {
        var that = this
        bgMusic.pause()
        that.setData({
            isOpen: false,
        })
    },
    listenerButtonStop() {
        var that = this
        bgMusic.stop()
    },
    // 进度条拖拽
    sliderChange(e) {
        var that = this
        var offset = parseInt(e.detail.value);
        bgMusic.play();
        bgMusic.seek(offset);
        that.setData({
            isOpen: true,
        })
    },
    // 页面卸载时停止播放
    onUnload() {
        var that = this
        that.listenerButtonStop()//停止播放
        console.log("离开")
    },
})