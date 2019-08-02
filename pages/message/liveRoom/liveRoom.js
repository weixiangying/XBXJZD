const network = require("../../../utils/network.js");
const wxParse = require('../../../wxParse/wxParse.js');
const moment = require("../../../utils/moment.js");
const webim = require('../../../utils/webim_wx.min.js');
const login = require('../../../utils/IM_Login.js');
const logout = require('../../../utils/IM_Logout.js');
const convertMsg = require("../../../utils/convert_msg.js");
const recentContactListManager = require("../../../utils/recent_contact_list_manager.js");
const app = getApp();
var reqMsgCount = 10;
var flag = 1;
var innerAudioContext = null;
var interval = null;
var msgtosend = '';


Page({
    data: {
        base: '../../../',
        title: '',
        msgList: [],
        typ: '',
        audioImg: 1,
        soundTime: ''
    },
    onLoad: function(options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function() {
        var that = this;
        this.independentModeLogin();
    },
    //独立模式登录
    independentModeLogin() {
        var that = this;
        //监听事件
        var listeners = {
            //监听连接状态回调变化事件,必填
            "onConnNotify": login.onConnNotify,
            //IE9(含)以下浏览器用到的jsonp回调函数
            "jsonpCallback": login.jsonpCallback,
            //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
            "onMsgNotify": function(msg) {
                // console.log(msg);
                that.onMsgNotify(msg);
            },
            //监听新消息(直播聊天室)事件，直播场景下必填
            "onBigGroupMsgNotify": function(msg) {
                // console.log(msg);
                // that.onBigGroupMsgNotify(msg);
            },
            //监听（多终端同步）群系统消息事件，如果不需要监听，可不填
            "onGroupSystemNotifys": login.onGroupSystemNotifys,
            //监听群资料变化事件，选填
            // "onGroupInfoChangeNotify": receiveGroupSystemMsg.onGroupInfoChangeNotify,
            //监听好友系统通知事件，选填
            "onFriendSystemNotifys": login.onFriendSystemNotifys,
            //监听资料系统（自己或好友）通知事件，选填
            "onProfileSystemNotifys": login.onProfileSystemNotifys,
            //被其他登录实例踢下线
            "onKickedEventCall": logout.onKickedEventCall,
            //监听C2C系统消息通道
            "onC2cEventNotifys": login.onC2cEventNotifys,
            //申请文件/音频下载地址的回调
            "onAppliedDownloadUrl": login.onAppliedDownloadUrl
        };
        login.webimLogin(listeners, that.loginCallback);
    },
    loginCallback() {
        var that = this;
        var tempSess, sessType, sessionId;
        // console.log(app);
        //设置标题
        if (app.C2C_Info) {
            sessType = 'C2C';
            sessionId = app.C2C_Info.selToID;
            that.setData({
                title: app.C2C_Info.C2cNick,
                typ: 1
            });
        } else {
            sessType = 'GROUP';
            sessionId = app.GROUP_Info.selToID;
            that.setData({
                title: app.GROUP_Info.GroupNick,
                typ: 2
            });
        }
        //保存到最近联系人,拉取历史记录使用
        tempSess = app.recentSessMap[sessType + "_" + sessionId];
        if (!tempSess) {
            recentContactListManager.initRecentContactList(function(res) {
                // console.log(res);
                // console.log(app.recentSessMap);
            });
        }

        //同步消息，私聊
        webim.syncMsgs(function(res) {
            // console.log(res);
            if (res.length > 0) {
                that.onMsgNotify(res);
            } else {
                // that.getHistory();
            }
        });
    },
    getHistory() {
        var that = this;
        // console.log(that.data.msgList.length);
        if (that.data.msgList.length > 0) {
            flag = 2;
        }
        if (app.C2C_Info) {
            that.getLastC2CHistoryMsgs(function(res) {
                // console.log(res);
                that.onMsgNotify(res);
            }, function(err) {
                console.log(err);
            });
        } else {
            that.getLastGroupHistoryMsgs(function(res) {
                // console.log(res);
                that.onMsgNotify(res);
            }, function(err) {
                console.log(err);
            });
        }
    },
    onMsgNotify(newMsgList) {
        var that = this;
        var newMsg, selSess;
        for (var j in newMsgList) {
            newMsg = newMsgList[j];
            // console.log(newMsg);
            that.handlderMsg(newMsg);
        }
    },
    handlderMsg(msg) {
        // console.log(msg);
        var fromAccount, fromAccountNick, fromAccountImage, sessType, subType, contentHtml, isSelfSend, time, that = this,
            seconds = 0,
            soundUrl = '';

        time = msg.getTime(); //消息发送的时间
        // console.log(time);
        isSelfSend = msg.getIsSend();
        if (isSelfSend) {
            if (app.loginInfo.identifierNick) {
                fromAccountNick = app.loginInfo.identifierNick;
            } else {
                fromAccountNick = fromAccount;
            }
            //获取头像
            if (app.loginInfo.headurl) {
                fromAccountImage = app.loginInfo.headurl;
            } else {
                fromAccountImage = app.defaultHeadUrl;
            }
        } else {
            var key = webim.SESSION_TYPE.C2C + "_" + fromAccount;
            var info = app.infoMap[key];
            if (info && info.name) {
                fromAccountNick = info.name;
            } else if (msg.getFromAccountNick()) {
                fromAccountNick = msg.getFromAccountNick();
            } else {
                fromAccountNick = fromAccount;
            }
            //获取头像
            if (info && info.image) {
                fromAccountImage = info.image;
            } else if (msg.fromAccountHeadurl) {
                fromAccountImage = msg.fromAccountHeadurl;
            } else {
                fromAccountImage = app.defaultHeadUrl;
            }
        }

        sessType = msg.getSession().type(); //聊天类型
        // console.log(sessType);
        subType = msg.getSubType(); //消息类型
        // console.log(subType, webim.C2C_MSG_SUB_TYPE);
        switch (sessType) {
            case webim.SESSION_TYPE.C2C: //私聊消息
                switch (subType) {
                    case webim.C2C_MSG_SUB_TYPE.COMMON:
                        var obj = convertMsg.convertMsgtoHtml(msg);
                        seconds = obj.seconds;
                        soundUrl = obj.soundUrl;
                        contentHtml = obj.html;
                        webim.Log.warn('receive a new c2c msg: fromAccountNick=' + fromAccountNick + ", content=" + contentHtml);
                        // var opts = {
                        //     'To_Account': fromAccount,
                        //     'LastedMsgTime': msg.getTime()
                        // };
                        // webim.c2CMsgReaded(opts);
                        // console.error('收到一条c2c消息(好友消息或者全员推送消息): 发送人=' + fromAccountNick + ", 内容=" + contentHtml);
                        break;
                }
                break;
            case webim.SESSION_TYPE.GROUP: //群聊
                switch (subType) {
                    case webim.GROUP_MSG_SUB_TYPE.COMMON: //群普通消息
                        // contentHtml = convertMsg.convertMsgtoHtml(msg);
                        var obj = convertMsg.convertMsgtoHtml(msg);
                        seconds = obj.seconds;
                        soundUrl = obj.soundUrl;
                        contentHtml = obj.html;
                        break;
                    case webim.GROUP_MSG_SUB_TYPE.REDPACKET: //群红包消息
                        contentHtml = "[群红包消息]" + convertMsg.convertMsgtoHtml(msg).html;
                        break;
                    case webim.GROUP_MSG_SUB_TYPE.LOVEMSG: //群点赞消息
                        contentHtml = "[群点赞消息]" + convertMsg.convertMsgtoHtml(msg).html;
                        break;
                    case webim.GROUP_MSG_SUB_TYPE.TIP: //群提示消息
                        contentHtml = "[群提示消息]" + convertMsg.convertMsgtoHtml(msg).html;
                        break;
                }
                break;
        }
        var a = that.data.msgList;
        var isImg = false;
        var isAudio = false;
        var isVideo = false;

        if (contentHtml.indexOf('<img') != -1) {
            isImg = true;
        };
        if (contentHtml.indexOf('<audio') != -1) {
            // console.log(contentHtml);
            isAudio = true;
            // console.log(soundUrl);
        };
        if (contentHtml.indexOf('<video') != -1) {
            isVideo = true;
        };

        if (flag == 1) {
            a.push({
                sessType: sessType,
                subType: subType,
                fromAccountNick: fromAccountNick,
                fromAccountImage: fromAccountImage,
                contentHtml: contentHtml,
                isSelf: isSelfSend,
                time: time,
                timeStr: moment.unix(time).format('YYYY-MM-DD HH:MM:SS'),
                isImg: isImg,
                isAudio: isAudio,
                seconds: seconds,
                soundUrl: soundUrl,
                isVideo: isVideo
            });
        } else {
            a.unshift({
                sessType: sessType,
                subType: subType,
                fromAccountNick: fromAccountNick,
                fromAccountImage: fromAccountImage,
                contentHtml: contentHtml,
                isSelf: isSelfSend,
                time: time,
                timeStr: moment.unix(time).format('YYYY-MM-DD HH:MM:SS'),
                isImg: isImg,
                isAudio: isAudio,
                seconds: seconds,
                soundUrl: soundUrl,
                isVideo: isVideo
            });
        }
        // console.log(a);
        for (let i = 0; i < a.length; i++) {
            wxParse.wxParse('content' + i, 'html', a[i].contentHtml, that);
            if (i === a.length - 1) {
                wxParse.wxParseTemArray("contentList", 'content', a.length, that);
            }
        };
        that.setData({
            msgList: a
        });

        

        //设置已读
        var selSess = msg.getSession();
        // console.log(msg);
        webim.setAutoRead(selSess, true, false);
    },
    //获取最新的 C2C 历史消息
    getLastC2CHistoryMsgs(cbOk, cbError) {
        var that = this;
        if (app.selType == webim.SESSION_TYPE.GROUP) {
            wx.showToast({
                title: '当前的聊天类型为群聊天，不能进行拉取好友历史消息操作',
                icon: 'none'
            });
            return;
        }
        var lastMsgTime = app.getPrePageC2CHistroyMsgInfoMap[app.C2C_Info.selToID] ? app.getPrePageC2CHistroyMsgInfoMap[app.C2C_Info.selToID].LastMsgTime : that.data.msgList.length > 0 ? that.data.msgList[that.data.msgList.length - 1].time : 0;
        // var msgKey = '';
        var options = {
            'Peer_Account': app.C2C_Info.selToID, //好友帐号
            'MaxCnt': reqMsgCount, //拉取消息条数
            'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
            'MsgKey': app.getPrePageC2CHistroyMsgInfoMap[app.C2C_Info.selToID] ? app.getPrePageC2CHistroyMsgInfoMap[app.C2C_Info.selToID].MsgKey : ''
        };
        // console.log(options.LastMsgTime);       -
        webim.getC2CHistoryMsgs(
            options,
            function(resp) {
                // console.log(resp);
                var complete = resp.Complete; //是否还有历史消息可以拉取，1-表示没有，0-表示有
                var retMsgCount = resp.MsgCount; //返回的消息条数，小于或等于请求的消息条数，小于的时候，说明没有历史消息可拉取了
                if (resp.MsgList.length == 0) {
                    console.log("没有历史消息了:data=" + JSON.stringify(options));
                    wx.showToast({
                        title: '没有历史消息了',
                        icon: 'none'
                    });
                    return;
                }
                app.getPrePageC2CHistroyMsgInfoMap[app.C2C_Info.selToID] = { //保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
                    'LastMsgTime': resp.LastMsgTime,
                    'MsgKey': resp.MsgKey
                };
                // console.log('----' + resp.LastMsgTime);
                if (cbOk)
                    cbOk(resp.MsgList);
            },
            cbError
        );
    },
    //获取最新的群历史消息
    getLastGroupHistoryMsgs(cbOk, cbError) {
        if (app.selType == webim.SESSION_TYPE.C2C) {
            wx.showToast({
                title: '当前的聊天类型为好友聊天，不能进行拉取群历史消息操作',
                icon: 'none'
            });
            return;
        }
        this.getGroupInfo(app.GROUP_Info.selToID, function(resp) {
            // console.log('群资料===', resp);
            // console.log(groupHistroyMsgInfo.ReqMsgSeq);
            var options = {
                'GroupId': app.GROUP_Info.selToID,
                'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq - 1,
                'ReqMsgNumber': reqMsgCount
            };
            if (options.ReqMsgSeq == null || options.ReqMsgSeq == undefined || options.ReqMsgSeq <= 0) {
                console.log("该群还没有历史消息:options=" + JSON.stringify(options));
                wx.showToast({
                    title: '该群还没有历史消息',
                    icon: 'none'
                });
                return;
            }
            webim.syncGroupMsgs(
                options,
                function(msgList) {
                    // console.log(msgList);
                    if (msgList.length == 0) {
                        console.log("该群没有历史消息了:options=" + JSON.stringify(options));
                        wx.showToast({
                            title: '该群没有历史消息了',
                            icon: 'none'
                        });
                        return;
                    }
                    app.getPrePageGroupHistroyMsgInfoMap[app.GROUP_Info.selToID] = {
                        "ReqMsgSeq": msgList[msgList.length - 1].MsgSeq - 1
                    };
                    if (cbOk)
                        cbOk(msgList);
                },
                function(err) {
                    console.log(err.ErrorInfo);
                }
            );
        }, function(err) {
            console.log(err);
        });
    },
    //群资料
    getGroupInfo(group_id, cbOK, cbErr) {
        var options = {
            'GroupIdList': [
                group_id
            ],
            'GroupBaseInfoFilter': [
                'Type',
                'Name',
                'Introduction',
                'Notification',
                'FaceUrl',
                'CreateTime',
                'Owner_Account',
                'LastInfoTime',
                'LastMsgTime',
                'NextMsgSeq',
                'MemberNum',
                'MaxMemberNum',
                'ApplyJoinOption'
            ],
            'MemberInfoFilter': [
                'Account',
                'Role',
                'JoinTime',
                'LastSendMsgTime',
                'ShutUpUntil'
            ]
        };
        webim.getGroupInfo(
            options,
            function(resp) {
                // console.log(resp);
                if (cbOK) {
                    cbOK(resp);
                }
            },
            function(err) {
                console.log(err.ErrorInfo);
            }
        );
    },
    onPullDownRefresh() {
        this.getHistory();
    },
    // onPageScroll(e){
    //     this.getHistory();
    // },
    inputFn(e) {
        msgtosend = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    sendMsg(e) {
        // console.log(flag);
        flag = 1;
        var that = this;
        var msgLen = webim.Tool.getStrBytes(msgtosend);
        if (msgtosend.length < 1) {
            return;
        }
        var maxLen, errInfo, selSess;
        if (app.selType == webim.SESSION_TYPE.C2C) {
            maxLen = webim.MSG_MAX_LENGTH.C2C;
            errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
        } else {
            maxLen = webim.MSG_MAX_LENGTH.GROUP;
            errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
        }
        if (msgLen > maxLen) {
            wx.showToast({
                title: errInfo,
                icon: 'none'
            });
            return;
        }

        if (app.C2C_Info) {
            selSess = new webim.Session(app.selType, app.C2C_Info.selToID, app.C2C_Info.selToID, app.C2C_Info.C2cImage, Math.round(new Date().getTime() / 1000));
        } else {
            selSess = new webim.Session(app.selType, app.GROUP_Info.selToID, app.GROUP_Info.selToID, app.GROUP_Info.GroupImage, Math.round(new Date().getTime() / 1000));
        }

        var isSend = true; //是否为自己发送
        var seq = -1; //消息序列，-1表示 SDK 自动生成，用于去重
        var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
        var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
        var subType; //消息子类型

        if (app.selType == webim.SESSION_TYPE.C2C) {
            subType = webim.C2C_MSG_SUB_TYPE.COMMON;
        } else {
            //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
            //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
            //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
            //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
            subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
        }

        var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, app.loginInfo.identifier, subType, app.loginInfo.identifierNick);

        var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
        //解析文本和表情
        var expr = /\[[^[\]]{1,3}\]/mg;
        var emotions = msgtosend.match(expr);
        if (!emotions || emotions.length < 1) {
            text_obj = new webim.Msg.Elem.Text(msgtosend);
            msg.addText(text_obj);
        } else {
            for (var i = 0; i < emotions.length; i++) {
                tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
                if (tmsg) {
                    text_obj = new webim.Msg.Elem.Text(tmsg);
                    msg.addText(text_obj);
                }
                emotionIndex = webim.EmotionDataIndexs[emotions[i]];
                emotion = webim.Emotions[emotionIndex];
                if (emotion) {
                    face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
                    msg.addFace(face_obj);
                } else {
                    text_obj = new webim.Msg.Elem.Text(emotions[i]);
                    msg.addText(text_obj);
                }
                restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
                msgtosend = msgtosend.substring(restMsgIndex);
            }
            if (msgtosend) {
                text_obj = new webim.Msg.Elem.Text(msgtosend);
                msg.addText(text_obj);
            }
        }
        webim.sendMsg(msg, function(resp) {
            if (app.selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
                that.handlderMsg(msg);
            }
            // if (app.C2C_Info){       
            //     webim.Tool.setCookie("tmpmsg_" + app.C2C_Info.selToID, '', 0);
            // }else{
            //     webim.Tool.setCookie("tmpmsg_" + app.GROUP_Info.selToID, '', 0);
            // }
            that.clearInput();
        }, function(err) {
            console.log(err.ErrorInfo);
        });
    },
    audioEV(e) {
        var that = this;
        var a = e.currentTarget.dataset.item;
        // console.log(a);
        if (a.isAudio) {
            if (innerAudioContext && that.data.soundTime == a.time) {
                // console.log(innerAudioContext.paused);
                if (innerAudioContext.paused) {
                    // console.log(innerAudioContext.play);
                    innerAudioContext.play();
                } else {
                    clearInterval(interval);
                    innerAudioContext.pause();
                    that.setData({
                        audioImg: 1
                    });
                }
            } else {
                innerAudioContext = wx.createInnerAudioContext();
                innerAudioContext.autoplay = true;
                innerAudioContext.volume = 1;
                innerAudioContext.obeyMuteSwitch = false;
                innerAudioContext.src = a.soundUrl;
                // innerAudioContext.play();
                // console.log(innerAudioContext);
                that.setData({
                    soundTime: a.time
                });
                innerAudioContext.onPlay(() => {
                    var i = that.data.audioImg;
                    interval = setInterval(function() {
                        i++;
                        // console.log(i);
                        that.setData({
                            audioImg: i
                        });
                        i %= 3;
                    }, 500);
                })
                innerAudioContext.onPause(() => {
                    clearInterval(interval);
                    that.setData({
                        audioImg: 1
                    });
                })
                innerAudioContext.onEnded(() => {
                    clearInterval(interval);
                    that.setData({
                        audioImg: 1
                    });
                })
                innerAudioContext.onError((res) => {
                    console.log(res.errMsg, res.errCode);
                })
            }
        }
    },
    clearInput: function() {
        this.setData({
            msg: ''
        });
    },
    toGroupInfo() {
        wx.navigateTo({
            url: '/pages/message/groupInfo/groupInfo'
        })
    },
    toFrdInfo() {
        // console.log(app);
        wx.navigateTo({
            url: '/pages/message/frdInfo/frdInfo?id=' + app.C2C_Info.selToID + '&mobile= '
        })
    },
    onUnload: function() {
        innerAudioContext && innerAudioContext.destroy();
        interval && clearInterval(interval);
        flag = 1;
        this.setData({
            msgList: [],
            audioImg: 1,
            soundTime: ''
        });
    }
})