const webim = require('./webim_wx.min.js');
const app = getApp();
var loginInfo = app.loginInfo;
var totalCount = 200;
var friend_image = '';


//将我的好友资料（昵称和头像）保存在app.infoMap
var initInfoMapByMyFriends = function (cbOK) {

    var options = {
        'From_Account': loginInfo.identifier,
        'TimeStamp': 0,
        'StartIndex': 0,
        'GetCount': totalCount,
        'LastStandardSequence': 0,
        "TagList": [
            "Tag_Profile_IM_Nick",
            "Tag_Profile_IM_Image"
        ]
    };

    webim.getAllFriend(
        options,
        function (resp) {
            // console.log('所有好友===', resp);
            if (resp.FriendNum > 0) {

                var friends = resp.InfoItem;
                if (!friends || friends.length == 0) {
                    if (cbOK)
                        cbOK();
                    return;
                }
                var count = friends.length;

                for (var i = 0; i < count; i++) {
                    var friend = friends[i];
                    var friend_account = friend.Info_Account;
                    var friend_name = friend_image = '';
                    for (var j in friend.SnsProfileItem) {
                        switch (friend.SnsProfileItem[j].Tag) {
                            case 'Tag_Profile_IM_Nick':
                                friend_name = friend.SnsProfileItem[j].Value;
                                break;
                            case 'Tag_Profile_IM_Image':
                                friend_image = friend.SnsProfileItem[j].Value;
                                break;
                        }
                    }
                    var key = webim.SESSION_TYPE.C2C + "_" + friend_account;
                    app.infoMap[key] = {
                        'name': friend_name,
                        'image': friend_image
                    };
                }
                if (cbOK)
                    cbOK();
            }
        },
        function (err) {
            console.log(err.ErrorInfo);
        }
    );
};

module.exports = {
    initInfoMapByMyFriends: initInfoMapByMyFriends
}