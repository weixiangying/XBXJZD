// pages/task/task.js
var network = require("../../utils/network.js");
const app = getApp();
var uid = '';
var uid_first = '';
Page({

    data: {
        list:[],
        listtab: [],

        tasklist: [],
        showEmpty: false,        
        prowidth: '',
        taskid: '',
        nostudent: false,
    },

    onLoad: function (options) {
        var that=this;
        // console.log(options)
        
        that.setData({
            prowidth: app.systemInfo.windowWidth / 750 * 250
        })
        var a = wx.getStorageSync('choicestu_task');
        if (!a) {
            that.setData({
                nostudent: true
            })
        }      
    },
    onShow: function () {
        var that=this;
        that.getStudentListNew();
        
    },
    getList: function () {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        // console.log(currentdate);


        var starttime = new Date(currentdate);
        starttime = +starttime - 1000 * 60 * 60 * 24 * 29;
        starttime = new Date(starttime);
        var year = starttime.getFullYear();
        var mon = starttime.getMonth() + 1;
        var day = starttime.getDate();
        var s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
        // console.log(s);

        var endtime = new Date(currentdate);
        endtime = +endtime + 1000 * 60 * 60 * 24 * 29;
        endtime = new Date(endtime);
        var yeard = endtime.getFullYear();
        var mond = endtime.getMonth() + 1;
        var dayd = endtime.getDate();
        var sd = yeard + "-" + (mond < 10 ? ('0' + mond) : mond) + "-" + (dayd < 10 ? ('0' + dayd) : dayd);
        // console.log(sd);

        var that = this;
        
        network.POST({
            url: 'v16/task-public/history',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "bu_id": uid,
                "startdate": s,
                "enddate": sd,

            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list

                    that.setData({
                        tasklist: a,                        
                        showEmpty: a.length == 0 ? true : false
                    });

                    // that.setData({
                    //     tasklist: [
                    //         {
                    //             "id": "194",
                    //             "taskid": "9",
                    //             "taskname": "理财任务",
                    //             "tasktype": "2",
                    //             "status": "1",
                    //             "type": "1",
                    //             "num": "3",
                    //             "all": "5",
                    //             "startdate": "2019.01.21 00:00",
                    //             "enddate": "2019.01.27 23:59",
                    //             "info2": "用户通过学霸学-预习乐模块。",
                    //             "receive_type": "2",
                    //             "score": 0,
                    //             "receiveGoods": [
                    //                 {
                    //                     "id": "301",
                    //                     "image": "http://img.doudou-le.com/cfb.jpg"
                    //                 }
                    //             ]
                    //         },
                    //         {
                    //             "id": "1943",
                    //             "taskid": "93",
                    //             "taskname": "理财任务",
                    //             "tasktype": "2",
                    //             "status": "1",
                    //             "type": "1",
                    //             "num": "3",
                    //             "all": "5",
                    //             "startdate": "2019.01.21 00:00",
                    //             "enddate": "2019.01.27 23:59",
                    //             "info2": "用户通过学霸学-预习乐模块。",
                    //             "receive_type": "2",
                    //             "score": 0,
                    //             "receiveGoods": [
                    //                 {
                    //                     "id": "301",
                    //                     "image": "http://img.doudou-le.com/cfb.jpg"
                    //                 }
                    //             ]
                    //         }
                    //     ],                                              
                    // });


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
    getStudentListNew: function () {
        var that = this;
        network.getStudentList(function (res) {

            if (res.data.code == 200) {
                var a = res.data.data[0].list;
                // console.log(a)
                if (a.length == 0) {
                    that.setData({
                        list: [],
                        listtab: [],
                        topempty: true,
                        showEmpty: true,
                    })
                    
                }
                else {
                    var storage_uid=wx.getStorageSync('choicestu_task');
                    // console.log(storage_uid)
                    if (storage_uid){                       
                        for(var i=0;i<a.length;i++){
                            if (a[i].uid == storage_uid){
                                // console.log(a[i])
                                that.setData({
                                    list: a,
                                    listtab: a[i],
                                })
                            }

                        }
                    }
                    else{
                        that.setData({
                            list: a,
                            listtab: a[0],                            
                        })
                    }

                    uid = that.data.listtab.uid;
                    uid_first = that.data.listtab.uid;
                    that.getList();
                    
                }
                
                
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        });


    },
    //跳转到选择学生
    tz_choicestu:function(){
        wx.navigateTo({
            url: '/pages/task/choicestu/choicestu',
        })
    },
    //
    tz_calendar: function () {
        var that = this;
        if (!that.data.nostudent) {
            wx.navigateTo({
                url: '/pages/task/calendarnew/calendarnew?uid=' + uid,
            })
        }
        else {
            wx.showToast({
                title: '请添加学生',
                icon: 'none',
                duration: 1000
            })
        }
        
    },
    click_zhankai: function (e) {
        // console.log(e)
        var that = this;
        var taskid = '';
        var taskid = that.data.taskid === e.currentTarget.dataset.taskid ? '' : e.currentTarget.dataset.taskid;
        that.setData({
            taskid: taskid
        })

        
    },
    tz_arrange: function () {
        var that = this;
        if (!that.data.nostudent) {
            wx.navigateTo({
                url: '/pages/task/arrange/arrange?uid=' + uid,
            })
        }
        else {
            wx.showToast({
                title: '请添加学生',
                icon: 'none',
                duration: 1000
            })
        }
        
    },
})