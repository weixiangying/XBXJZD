const app = getApp();
const request_url = app.requestUrl;
var requestHandler = {
    url: null,
    params: {},
    success: function () {
        // success
    },
    fail: function () {
        // fail
    }
};
function requesttools(method, requestHandler, flag) {
    !flag && app.showLoading();
    var params = requestHandler.params;
    var url = requestHandler.url;

    params.app_source_type = app.app_source_type;
    params.app_source_school_id = app.app_source_school_id;

    wx.request({
        url: request_url + url,
        data: params,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: method,
        success: function (res) {
            // console.log(res);
            if (res.data.code == "508" || res.data.code == "403") {
                wx.showToast({
                    title: res.data.message,
                    success: function () {
                        app.toLogin();
                    }
                });
            } else {
                requestHandler.success(res);
            }
        },
        fail: function () {
            requestHandler.fail();
        },
        complete: function (res) { }
    });
}
function GET(requestHandler) {
    var a = arguments[1];
    requesttools('GET', requestHandler, a);
}
function POST(requestHandler) {
    var a = arguments[1];
    requesttools('POST', requestHandler, a)
}
function getNews(page, callback, errCallback) {
    POST({
        url: 'v14/news/list',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "page": page
        },
        success: function (res) {
            callback(res);
        },
        fail: function () {
            errCallback();
        }
    });
}
function getAllAdress() {
    if (!app.allAddress) {
        POST({
            url: 'v9/address/index',
            params: {},
            success: function (res) {
                //   console.log(res);
                if (res.data.code == 200) {
                    app.allAddress = res.data.data;
                } else {
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res.data.message
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    title: '获取地址失败',
                    image: '../../images/error.png',
                    duration: 1000
                });
            }
        }, true);
    }
}

function getSelectedAdressInfo(arr) {
    var province = app.allAddress;
    var city = province[arr[0]].city;
    var district = city[arr[1]].district;

    return ([
        { id: province[arr[0]].id, name: province[arr[0]].province_name },
        { id: city[arr[1]].id, name: city[arr[1]].city_name },
        { id: district[arr[2]].id, name: district[arr[2]].district_name }
    ]);
}


function modifyPartInfo(obj, callback) {
    var params = obj;
    params.mobile = app.userInfo.mobile;
    params.token = app.userInfo.token;
    POST({
        url: 'v16/user-info/update',
        params: params,
        success: function (res) {
            wx.hideLoading();
            callback(res);
        },
        fail: function () {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            });
        }
    });
}

function getMyPoint(callback) {
    POST({
        url: 'v14/shop-point/my-score',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token
        },
        success: function (res) {
            wx.hideLoading();
            callback(res);
        },
        fail: function () {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                image: '../../images/error.png',
                duration: 1000
            })
        }
    });
}

//公共上传图片
function publicUpload(arr, callback) {
    var params = { "app_source_type": app.app_source_type, "app_source_school_id": app.app_source_school_id };
    wx.uploadFile({
        url: app.requestUrl + 'v14/public/upload',
        filePath: arr[0],
        name: 'file',
        formData: params,
        success: (res) => {
            var a = JSON.parse(res.data);
            wx.hideLoading();
            if (a.code == "508" || a.code == "403") {
                wx.showToast({
                    title: res.data.message,
                    success: function () {
                        app.toLogin();
                    },
                    icon: 'none'
                });
            } else if (a.code == 200) {
                callback(a);
            } else {
                wx.showToast({
                    title: a.message,
                    icon: 'none'
                });
            }
        },
        fail: (res) => {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            })
        },
        complete: () => { }
    });
}

function upload(url, arr, params, callback) {
    wx.showLoading({
        title: '上传中...'
    });
    params.app_source_type = app.app_source_type;
    params.app_source_school_id = app.app_source_school_id;

    wx.uploadFile({
        url: app.requestUrl + url,
        filePath: arr[0],
        name: 'file',
        formData: params,
        success: (res) => {
            var a = JSON.parse(res.data);
            // console.log(a);
            wx.hideLoading();
            if (a.code == "508" || a.code == "403") {
                wx.showToast({
                    title: res.data.message,
                    success: function () {
                        app.toLogin();
                    }
                });
            } else if (a.code == 200) {
                callback(a);
            } else {
                wx.showToast({
                    title: a.message
                });
            }
        },
        fail: (res) => {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                image: '../../images/error.png',
                duration: 1000
            })
        },
        complete: () => { }
    });
}
//获取积分
function getPoint(typeid, id, callback) {
    POST({
        url: 'v14/shop-point/add-score',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "typeid": typeid,
            "typeid_one": id
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
            wx.showToast({
                title: '服务器异常',
                image: '../../images/error.png',
                duration: 1000
            })
        }
    }, true);
}
//分享
function share(resourcetypeid, resourceid, callback) {
    POST({
        url: 'v14/news/share-add',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "resourcetypeid": resourcetypeid,
            "resourceid": resourceid
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
            wx.showToast({
                title: '服务器异常',
                image: '../../images/error.png',
                duration: 1000
            })
        }
    }, true);
}
// 收藏
function collect(resourcetypeid, resourceid, callback) {
    POST({
        url: 'v14/news/collect-add',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "resourcetypeid": resourcetypeid,
            "resourceid": resourceid
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
            wx.showToast({
                title: '服务器异常',
                image: '../../images/error.png',
                duration: 1000
            })
        }
    }, true);
}
//点赞
function addAgree(resourcetypeid, id, callback) {
    POST({
        url: 'v14/news/agree-add',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "resourcetypeid": resourcetypeid,
            "resourceid": id
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
        }
    }, true);
}
//家长绑定的学生列表
function getStudentList(callback) {
    POST({
        url: 'v16/user-bind/list',     //v16/user-bind/list
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token           
        },
        success: function (res) {
            callback && callback(res);
        },
        fail: function () {
        }
    }, true);
}


//轮播图
function getSwiperImgs(pos, callback) {
    POST({
        url: 'v14/adv/fudao',
        params: {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "type": app.swiperImgType,
            "position": pos
        },
        success: function (res) {
            // console.log(res);
            callback && callback(res);
        },
        fail: function () {
            wx.showToast({
                title: '服务器异常',
                image: '../../images/error.png',
                duration: 1000
            })
        }
    }, true);
}

//用户信息
function getUserInfo(callback) {
    var p = {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
    };
    if (arguments[1]) {
        
        p = {
            "mobile": app.userInfo.mobile,
            "token": app.userInfo.token,
            "user_id": arguments[1],
            "user_mobile": arguments[2]
        };
    };
    POST({
        url: 'v16/user-info/index',
        params: p,
        success: function (res) {
            callback && callback(res);
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

function arrToObj(arr) {
    var obj = {};
    var key = '';
    for (var i = 0; i < arr.length; i++) {
        key = i;
        obj[key] = arr[i];
    }
    return obj;
}
//图片点击放大
function previewImg(img, imgs) {
    // console.log(img , imgs);
    wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: imgs, // 需要预览的图片http链接列表
        success(res) {
            // console.log(res);
        }
    })
}
//微信支付
function wxPay(info, callback, callbackfail) {
    wx.requestPayment({
        'timeStamp': info.info.timeStamp + '',
        'nonceStr': info.info.nonceStr + '',
        'package': info.info.package + '',
        'signType': 'MD5',
        'paySign': info.info.paySign + '',
        'success': callback,
        'fail': callbackfail,
        'complete': function (res) {
            console.log(res);
        }
    })
}
//微信登录
function wxLogin(cb) {
    app.showLoading();
    wx.login({
        success: function (res) {
            // console.log(res);
            wx.hideLoading();
            if (res.code) {
                app.code = res.code;
                app.showLoading();
                wx.getUserInfo({
                    withCredentials: true,
                    success(res) {
                        // console.log(res);
                        app.uinfo.encryptedData = res.encryptedData;
                        app.uinfo.iv = res.iv;
                        // console.log(app.uinfo);
                        cb && cb();
                    },
                    complete() {
                        wx.hideLoading();
                    }
                });
            } else {
                wx.showToast({
                    title: 'code不存在',
                    icon: 'none'
                });
            }
        },
        fail(err) {
            wx.hideLoading();
            wx.showToast({
                title: '微信登录失败,' + res.errMsg,
                icon: 'none'
            });
        }
    });
}
//获取openid
function getOpenid(cb) {
    var params = {};

    params.code = app.code;
    params.encryptedData = app.uinfo.encryptedData;
    params.iv = app.uinfo.iv;

    // console.log(params);
    POST({
        url: 'v14/public/get-opend',
        params: params,
        success: function (res) {
            console.log(res);
            wx.hideLoading();

            if (res.data.code == 200) {
                app.openId = res.data.data.openid;

                cb && cb();
            }
        },
        fail: function (err) {
            wx.hideLoading();
            console.log(err);
            wx.showToast({
                title: '出错了~',
                icon: 'none'
            });
        },
        complete(err) {
            console.log(err);
        }
    });
}
module.exports = {
    GET: GET,
    POST: POST,
    getNews: getNews,
    getAllAdress: getAllAdress,
    modifyPartInfo: modifyPartInfo,
    getMyPoint: getMyPoint,
    upload: upload,
    publicUpload: publicUpload,
    getPoint: getPoint,
    getSelectedAdressInfo: getSelectedAdressInfo,
    share: share,
    collect: collect,
    addAgree: addAgree,
    getSwiperImgs: getSwiperImgs,
    
    getUserInfo: getUserInfo,
    getStudentList: getStudentList,
    arrToObj: arrToObj,
    previewImg: previewImg,
    wxPay: wxPay,
    wxLogin: wxLogin,
    getOpenid: getOpenid
};