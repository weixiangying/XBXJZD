//app.js
App({
  requestUrl: 'https://social.54xuebaxue.com/',
  imgUrl: 'https://m.54xuebaxue.com/wx_img/',

  // requestUrl:'http://social.test.54xuebaxue.com/',
  // imgUrl: 'https://m.test.54xuebaxue.com/wx_img/',
    
    idname:'学霸学',
    // idname: '素质教育平台',
    // idname: '弹个课',
    //idname: '铁巢智能',

    stuAppId: 'wx2bec8bfcd0d04b28',//学霸学学生端
    // stuAppId:'wx9addd47cde3e6094',//素质教育学生端
    // stuAppId: 'wx74413fd172261fd6',//弹个课学生端
    // stuAppId: 'wxa6430a50baf97cf7',//铁巢智能学生端
    
    app_source_school_id: 0,//学霸学
    //app_source_school_id: 20619,//铁巢


    uinfo: {
        encryptedData: '',
        iv: ''
    },
    code: '',
    openId: '',

    appId: 'wxee68233581f4965a',  // 家长端
    app_source_type: 6,
    swiperImgType: 'xbxjz',
    version:'1.0.6',
    sdkappid: 1400027766,
    accountType: 11731,
    accountMode: 0,
    contactTel: '024-66909606',   
    tulingUrl: 'https://openapi.tuling123.com/openapi/api/v2',
    tulingKey: '8a64a86efb1343359e5d28259fdbbeb2',
    
    userInfo: null,
    systemInfo: null,
    allAddress: null,
    studyOptions: null,//学习分类
    longitude: null, //地理位置
    latitude: null, //地理位置
    peripheryCourse: [],//精品课程搜索历史
    msgFrdList: [], //消息好友列表,
    loginInfo: {}, // 聊天、直播通用
    infoMap: {}, // 聊天初始化时,拉取我的好友和我的群组信息
    recentSessMap: {}, //保存最近会话列表
    defaultHeadUrl: '/images/default_user.png', //默认头像路径
    selType: '', //当前聊天类型    
    C2C_Info: {},
    GROUP_Info: {},
    getPrePageGroupHistroyMsgInfoMap: {},//群聊历史
    getPrePageC2CHistroyMsgInfoMap: {},//私聊历史

    toLogin: function () {
        wx.reLaunch({
            url: '/pages/login/login'
        });
    },
    showLoading: function () {
        wx.showLoading({
            title: '加载中...'
        })
    },
    webViewLimitate() {
        wx.showToast({
            title: 'WebVIEW超过极限, 请关闭页面重试',
            icon: 'none'
        });
    },
    onLaunch: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                // console.log(res);
                that.systemInfo = res;
            }
        });
    },
    onShow: function () {
        var that = this;
        that.userInfo = wx.getStorageSync('userInfo');
        // console.log(that.userInfo);
    }
})