const app = getApp();
const webim = require('./webim_wx.min.js');
const logout = require("./IM_Logout.js");
const receiveGroupSystemMsg = require("./receive_group_system_msg.js");
const receiveFriendSystemMsg = require("./receive_friend_system_msg.js");
const receiveNewMsg = require("./receive_new_msg.js");
const receiveProfileSystemMsg = require("./receive_profile_system_msg.js");


//当前用户身份
var loginInfo = {
    'sdkAppID': app.sdkappid, //用户所属应用id,必填
    'accountType': app.accountType, //用户所属应用帐号类型，必填
    'identifier': app.userInfo.id, //当前用户ID,必须是否字符串类型，必填
    'identifierNick': app.userInfo.nickname, //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
    'userSig': app.userInfo.user_sig, //当前用户身份凭证，必须是字符串类型，必填
    'headurl': app.defaultHeadUrl //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
};
app.loginInfo = loginInfo;



var emotionFlag = false; //是否打开过表情选择框

var curPlayAudio = null; //当前正在播放的audio对象

var getPrePageC2CHistroyMsgInfoMap = {}; //保留下一次拉取好友历史消息的信息
var getPrePageGroupHistroyMsgInfoMap = {}; //保留下一次拉取群历史消息的信息


//监听（多终端同步）群系统消息方法，方法都定义在receive_group_system_msg.js文件中
//注意每个数字代表的含义，比如，
//1表示监听申请加群消息，2表示监听申请加群被同意消息，3表示监听申请加群被拒绝消息
var onGroupSystemNotifys = {
    "1": receiveGroupSystemMsg.onApplyJoinGroupRequestNotify, //申请加群请求（只有管理员会收到）
    "2": receiveGroupSystemMsg.onApplyJoinGroupAcceptNotify, //申请加群被同意（只有申请人能够收到）
    "3": receiveGroupSystemMsg.onApplyJoinGroupRefuseNotify, //申请加群被拒绝（只有申请人能够收到）
    "4": receiveGroupSystemMsg.onKickedGroupNotify, //被管理员踢出群(只有被踢者接收到)
    "5": receiveGroupSystemMsg.onDestoryGroupNotify, //群被解散(全员接收)
    "6": receiveGroupSystemMsg.onCreateGroupNotify, //创建群(创建者接收)
    "7": receiveGroupSystemMsg.onInvitedJoinGroupNotify, //邀请加群(被邀请者接收)
    "8": receiveGroupSystemMsg.onQuitGroupNotify, //主动退群(主动退出者接收)
    "9": receiveGroupSystemMsg.onSetedGroupAdminNotify, //设置管理员(被设置者接收)
    "10": receiveGroupSystemMsg.onCanceledGroupAdminNotify, //取消管理员(被取消者接收)
    "11": receiveGroupSystemMsg.onRevokeGroupNotify, //群已被回收(全员接收)
    "15": receiveGroupSystemMsg.onReadedSyncGroupNotify, //群消息已读同步通知
    "255": receiveGroupSystemMsg.onCustomGroupNotify, //用户自定义通知(默认全员接收)
    "12": receiveGroupSystemMsg.onInvitedJoinGroupNotifyRequest//邀请加群(被邀请者接收,接收者需要同意)
};

//监听好友系统通知函数对象，方法都定义在receive_friend_system_msg.js文件中
var onFriendSystemNotifys = {
    "1": receiveFriendSystemMsg.onFriendAddNotify, //好友表增加
    "2": receiveFriendSystemMsg.onFriendDeleteNotify, //好友表删除
    "3": receiveFriendSystemMsg.onPendencyAddNotify, //未决增加
    "4": receiveFriendSystemMsg.onPendencyDeleteNotify, //未决删除
    "5": receiveFriendSystemMsg.onBlackListAddNotify, //黑名单增加
    "6": receiveFriendSystemMsg.onBlackListDeleteNotify //黑名单删除
};

var onC2cEventNotifys = {
    "92": receiveNewMsg.onMsgReadedNotify, //消息已读通知,
    "96": logout.onMultipleDeviceKickedOut
};

//监听资料系统通知函数对象，方法都定义在receive_profile_system_msg.js文件中
var onProfileSystemNotifys = {
    "1": receiveProfileSystemMsg.onProfileModifyNotify //资料修改
};

//监听连接状态回调变化事件
var onConnNotify = function (resp) {
    var info;
    switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
            webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
            break;
        case webim.CONNECTION_STATUS.OFF:
            info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
            // alert(info);
            webim.Log.warn(info);
            break;
        case webim.CONNECTION_STATUS.RECONNECT:
            info = '连接状态恢复正常: ' + resp.ErrorInfo;
            // alert(info);
            webim.Log.warn(info);
            break;
        default:
            webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
            break;
    }
};

//IE9(含)以下浏览器用到的jsonp回调函数
function jsonpCallback(rspData) {
    webim.setJsonpLastRspData(rspData);
}

//申请文件/音频下载地址的回调
function onAppliedDownloadUrl(data) {
    console.debug(data);
}



var isAccessFormalEnv = true; //是否访问正式环境



var isLogOn = false; //是否开启sdk在控制台打印日志

//初始化时，其他对象，选填
var options = {
    'isAccessFormalEnv': isAccessFormalEnv, //是否访问正式环境，默认访问正式，选填
    'isLogOn': isLogOn //是否开启控制台打印日志,默认开启，选填
}


//sdk登录

function webimLogin(listeners, callback) {
    webim.login(
        loginInfo, listeners, options,
        function(resp) {
            loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
            loginInfo.headurl = resp.headurl; //设置当前用户头像
            callback();
        },
        function(err) {
            console.log(err);
        }
    );
}


module.exports = {
    onConnNotify: onConnNotify,
    jsonpCallback: jsonpCallback,
    onGroupSystemNotifys: onGroupSystemNotifys,
    onFriendSystemNotifys: onFriendSystemNotifys,
    onProfileSystemNotifys: onProfileSystemNotifys,
    onC2cEventNotifys: onC2cEventNotifys,
    onAppliedDownloadUrl: onAppliedDownloadUrl,
    webimLogin: webimLogin
};