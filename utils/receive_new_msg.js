const webim = require('./webim_wx.min.js');
const app = getApp();


//消息已读通知
function onMsgReadedNotify(notify) {
    var sessMap = webim.MsgStore.sessMap()[webim.SESSION_TYPE.C2C+notify.From_Account];
    if(sessMap){
        var msgs = _.clone(sessMap.msgs());
        var rm_msgs = _.remove(msgs,function(m){
            return m.time <= notify.LastReadTime
        });
        var unread = sessMap.unread()  - rm_msgs.length;
        unread = unread > 0 ? unread : 0;
        //更新sess的未读数
        sessMap.unread( unread );
        console.debug('更新C2C未读数:',notify.From_Account,unread);
        //更新页面的未读数角标
        // if(unread > 0 ){
        //     $("#badgeDiv_"+notify.From_Account).text(unread).show();
        // }else{
        //     $("#badgeDiv_"+notify.From_Account).val("").hide();
        // }
    }
}


module.exports = {
    onMsgReadedNotify: onMsgReadedNotify
};