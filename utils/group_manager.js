const webim = require('./webim_wx.min.js');
const app = getApp();
var loginInfo = app.loginInfo;
var totalCount = 200; //每次接口请求的条数



//将我的群组资料（群名称和群头像）保存在 app.infoMap
var initInfoMapByMyGroups = function (cbOK) {

    var options = {
        'Member_Account': loginInfo.identifier,
        'Limit': totalCount,
        'Offset': 0,
        'GroupBaseInfoFilter': [
            'Name',
            'FaceUrl'
        ]
    };
    webim.getJoinedGroupListHigh(
        options,
        function (resp) {
            if (resp.GroupIdList && resp.GroupIdList.length) {
                for (var i = 0; i < resp.GroupIdList.length; i++) {
                    var group_name = resp.GroupIdList[i].Name;
                    var group_image = resp.GroupIdList[i].FaceUrl;
                    var key = webim.SESSION_TYPE.GROUP + "_" + resp.GroupIdList[i].GroupId;
                    app.infoMap[key] = {
                        'name': group_name,
                        'image': group_image
                    }
                }
            }
            if (cbOK) {
                cbOK();
            }
        },
        function (err) {
            console.log(err.ErrorInfo);
        }
    );
};

module.exports = {
    initInfoMapByMyGroups: initInfoMapByMyGroups
}