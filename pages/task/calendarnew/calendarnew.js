// pages/task/calendarnew/calendarnew.js
const network = require("../../../utils/network.js");
var util = require("../../../utils/time-utils.js");


const app = getApp();

var uid = '';
var cal_rule = '';
Page({

    data: {
        selectWeek: 0,
        timeBean: {},

        leftimg: '../../../images/icon_task_studyleft.png',
        rightimg: '../../../images/icon_task_studyright.png',

        list: [],
        showEmpty: false,
        taskid: '',

        taskweek: 1,
        showEmptyNew: true,

        lr_click:0,

        cal_rule:'',
        ifitemClick:false
    },
    getYearAndMonth: function (options) {
        // console.log(options)
        var that = this;
        var yearMonth = '';
        if (options) {
            yearMonth = options;
        }
        yearMonth = String(this.data.timeBean.yearMonth);
        yearMonth = yearMonth.split('-');
        var year = Number(yearMonth[0]);
        var month = Number(yearMonth[1]);
        that.setData({
            year: year,
            month: month
        })
    },
    onLoad: function (options){
        this.setData({
            timeBean: util.getWeekDayList(this.data.selectWeek),
            cal_rule: Number(util.getWeekDayList(this.data.selectWeek).selectDay)
        })
        cal_rule = this.data.cal_rule;
        // console.log(this.data.timeBean)
        // console.log(this.data.cal_rule)
        uid = options.uid;
      // console.log(uid)
        this.getList();
        this.getYearAndMonth(util.getWeekDayList(this.data.selectWeek).yearMonth);
    },
    lastWeek: function (e) { //点击了上一周
        this.triggerEvent("lastWeek")        
    },

    nextWeek: function (e) { //点击了下一周
        this.triggerEvent("nextWeek")
        
    },

    itemClick: function (e) {  //点击了某一日，传递该日的下标                
        var index = e.currentTarget.dataset.index

        var timeBean = this.data.timeBean
        timeBean.selectDay = e.currentTarget.dataset.index
        this.setData({
            timeBean,
            ifitemClick:true
        })
        // console.log(timeBean)
        
        var selectDayNum = Number(this.data.timeBean.selectDay);
        var theday;
        
        if (Number(this.data.timeBean.weekDayList[6].day) < Number(this.data.timeBean.weekDayList[0].day)){
            
            var yearMonth = String(this.data.timeBean.yearMonth);
            yearMonth = yearMonth.split('-');
            var year = Number(yearMonth[0]);
            var month = Number(yearMonth[1]);

            if (Number(index) > cal_rule){
                if (Number(this.data.timeBean.weekDayList[cal_rule].day) > Number(this.data.timeBean.weekDayList[selectDayNum].day) ){
                    month = month + 1;
                    if (month > 12) {
                        month = 1;
                        year++;
                    }
                }
            }
            else if (Number(index) < cal_rule){
                if (Number(this.data.timeBean.weekDayList[cal_rule].day) < Number(this.data.timeBean.weekDayList[selectDayNum].day)) {
                    month = month - 1;
                    if (month <1) {
                        month = 12;
                        year--;
                    }
                }
            }


            theday = year + '-' + month + '-' + this.data.timeBean.weekDayList[selectDayNum].day;
        }
        
        else {
            theday = this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[selectDayNum].day;
        }
        // console.log(theday)
        this.click_day(theday)
        
    },
    /**
     * 点击了上一周，选择周数字减一，然后直接调用工具类中一个方法获取到数据
     */
    lastWeek: function (e) {
        this.setData({
            leftimg: '../../../images/icon_task_studylefted.png',
            rightimg: '../../../images/icon_task_studyright.png',
            lr_click:1,
            taskweek: 1,
            ifitemClick: false
        })
        
        
        var selectWeek = --this.data.selectWeek;
        var timeBean = this.data.timeBean
        timeBean = util.getWeekDayList(selectWeek)

        if (selectWeek != 0) {
            timeBean.selectDay = 0;
        }

        this.setData({
            
            timeBean,
            selectWeek
        })
        this.getYearAndMonth();
        this.getList();
    },

    /**
     * 点击了下一周，选择周数字加一，然后直接调用工具类中一个方法获取到数据
     */
    nextWeek: function (e) {
        this.setData({
            leftimg: '../../../images/icon_task_studyleft.png',
            rightimg: '../../../images/icon_task_studyrighted.png',
            lr_click: 2,
            taskweek: 1,
            ifitemClick: false
        })
        var selectWeek = ++this.data.selectWeek;
        var timeBean = this.data.timeBean
        timeBean = util.getWeekDayList(selectWeek)

        if (selectWeek != 0) {
            timeBean.selectDay = 0;
        }

        this.setData({            
            timeBean,
            selectWeek
        })
        this.getYearAndMonth();
        this.getList();
    },

    getList: function () {
        var that = this;

        // console.log(this.data.timeBean)
        // console.log(this.data.timeBean.weekDayList)
        
        var startdata = this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[0].day;
        var enddate='';
        
        
        if (Number(this.data.timeBean.weekDayList[this.data.cal_rule].day) > Number(this.data.timeBean.weekDayList[6].day)){
            var yearMonth = String(this.data.timeBean.yearMonth);
            yearMonth = yearMonth.split('-');
            var year=Number(yearMonth[0]);
            var month = Number(yearMonth[1]);
           
            month=month+1;
            if(month>12){
                month=1;
                year++;
            }
            enddate = year + '-' + month + '-'+ this.data.timeBean.weekDayList[6].day;
            
        }
        else{
            enddate = this.data.timeBean.yearMonth + '-' + this.data.timeBean.weekDayList[6].day;
        }
    
        // console.log(enddate)

      
        network.POST({
            url: 'v16/task-public/history',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "bu_id": uid,
                "startdate": startdata,
                "enddate": enddate,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list

                    that.setData({
                        list: a,
                        toplist: res.data.data[0].item,
                        showEmpty: a.length == 0 ? true : false
                    });

                    // that.setData({
                    //     list: [
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
    click_zhankai: function (e) {
        // console.log(e)
        var that = this;
        var taskid = '';
        var taskid = that.data.taskid === e.currentTarget.dataset.taskid ? '' : e.currentTarget.dataset.taskid;
        that.setData({
            taskid: taskid
        })
    },
    click_day: function (theday) {
        var that = this;
        that.setData({
            taskweek: 2
        })
        
        
        network.POST({
            url: 'v16/task-public/history-detail',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "bu_id": uid,
                "thedate": theday,
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list

                    that.setData({
                        thedaylist: a,                        
                        showEmptyNew: a.length == 0 ? true : false
                    });
                    // console.log(that.data.taskweek)
                    
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
})