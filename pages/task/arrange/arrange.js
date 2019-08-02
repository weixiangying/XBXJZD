// pages/task/arrange/arrange.js
var network = require("../../../utils/network.js");
var dateTimePicker = require('../../../utils/dateTimePicker.js');
const app = getApp();
var uid='';
var goodsids=null;
Page({

    data: {
        typeArr: [],
        typeIndex: 0,

        starttime:'',
        endtime: '',
        csArr: [
            { id: 0, name: '请选择' },
            { id: 1, name: '1' },
            { id: 2, name: '2' },
            { id: 3, name: '3' },
            { id: 4, name: '4' },
            { id: 5, name: '5' },
            { id: 6, name: '6' },
            { id: 7, name: '7' },
            { id: 8, name: '8' },
            { id: 9, name: '9' },
            { id: 10, name: '10' },
            
        ],
        csIndex: 0,
        base: '../../../',
        imgList: [],


        date: '2018-10-01',
        time: '12:00',
        dateTimeArray: null,
        dateTime: null,
        dateTimeArray1: null,
        dateTime1: null,
        startYear: 2000,
        endYear: 2050,
        
    },

    onLoad: function (options) {
        console.log(options)

        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        // 精确到分的处理，将数组的秒去掉
        var lastArray = obj1.dateTimeArray.pop();
        var lastTime = obj1.dateTime.pop();

        this.setData({
            dateTime: obj.dateTime,
            dateTimeArray: obj.dateTimeArray,
            dateTimeArray1: obj1.dateTimeArray,
            dateTime1: obj1.dateTime
        });

        var that=this;
        uid = wx.getStorageSync('choicestu_task');
        // console.log(uid)
        that.getTaskType();
        
    },
    changeDateTime(e) {
        this.setData({ dateTime: e.detail.value });
        // console.log(this.data.dateTime)
        var aaaa = this.data.dateTimeArray[0][this.data.dateTime[0]] + '-' + this.data.dateTimeArray[1][this.data.dateTime[1]] + '-' + this.data.dateTimeArray[2][this.data.dateTime[2]] + ' ' + this.data.dateTimeArray[3][this.data.dateTime[3]] + ':' + this.data.dateTimeArray[4][this.data.dateTime[4]] + ':' + this.data.dateTimeArray[5][this.data.dateTime[5]] ;
        var that=this;
        that.setData({
            starttime: aaaa
        })
    },
    changeDateTimeColumn(e){
        var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
        this.setData({
            dateTimeArray: dateArr
        });
        // console.log(this.data.dateTimeArray)
    },
    changeDateTime2(e) {
        this.setData({ dateTime: e.detail.value });
        // console.log(this.data.dateTime)
        var aaaa = this.data.dateTimeArray[0][this.data.dateTime[0]] + '-' + this.data.dateTimeArray[1][this.data.dateTime[1]] + '-' + this.data.dateTimeArray[2][this.data.dateTime[2]] + ' ' + this.data.dateTimeArray[3][this.data.dateTime[3]] + ':' + this.data.dateTimeArray[4][this.data.dateTime[4]] + ':' + this.data.dateTimeArray[5][this.data.dateTime[5]];
        var that = this;
        that.setData({
            endtime: aaaa
        })
    },
    changeDateTimeColumn2(e) {
        var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
        this.setData({
            dateTimeArray: dateArr
        });
        // console.log(this.data.dateTimeArray)
    },
    onShow: function () {
        
        var goods = wx.getStorageSync('goods');
        goodsids = wx.getStorageSync('goodsids');
        var that=this;
        that.setData({
            goods: goods,
            
        })
        
    },
    getTaskType: function () {
        var that=this;
        network.POST({
            url: 'v16/task-public/task-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,                
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list
                    
                    a.unshift({
                        id: 0,
                        taskname: '请选择'
                    });
                    that.setData({
                        typeArr: a,
                    });
                    // console.log(that.data.typeArr)
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
    bindPickerType: function (e) {
        var that = this;
        that.setData({
            typeIndex: e.detail.value
        });
        // console.log(e.detail.value)
    },
    
    bindPickerStarttime: function (e) {
        var that = this;
        // var birth=e.detail.value;       
        // birth = that.translateTime(e.detail.value)
        that.setData({
            starttime: e.detail.value
        });

    },
    bindPickerEndtime: function (e) {
        var that = this;
        that.setData({
            endtime: e.detail.value
        });

    },
    bindPickerCs: function (e) {
        var that = this;
        that.setData({
            csIndex: e.detail.value
        });
        // console.log(e.detail.value)
    },
    //转换为时间戳
    translateTime: function (time) {
        var date = new Date(time.replace(/-/g, '/'));
        var timestamp = date.valueOf() / 1000;
        return timestamp
    },
    addImg:function(){
        var that=this;
        wx.setStorage({
            key: 'goods',
            data: that.data.goods,
        })
        wx.setStorage({
            key: 'goodsids',
            data: goodsids,
        })
        wx.navigateTo({
            url: '/pages/task/taskChoice/taskChoice',
        })
    },
    delImg: function (e) {
        var that = this;
        var goods = that.data.goods;
        var j = 0; // 设置要删除的数组下标
        for (var i = 0; i < goods.length; i++) {
            if (goods[i].id == e.currentTarget.dataset.goodsid) {
                j = i;
            }
        }        
        goods.splice(j, 1)
        
        
        that.setData({
            goods: goods
        })
        // console.log(goods)

        var k=0;
        for (var i = 0; i < goodsids.length; i++) {
            if (goodsids[i] == e.currentTarget.dataset.goodsid) {
                k = i;
            }
        } 
        goodsids.splice(k, 1)
        // console.log(goodsids)
    },
    
    bindFormSubmit: function (e) {
        var that = this;
        var list = that.data.imgList;//图片
        // console.log(list);
        var typeIndex = that.data.typeIndex;
        var starttime = that.data.starttime;
        var endtime = that.data.endtime;
        var csIndex = that.data.csIndex;
        var starttimeTemp = that.translateTime(starttime);
        var endtimeTemp = that.translateTime(endtime);
        // console.log(starttimeTemp)
        if (typeIndex==0) {
            wx.showToast({
                title: '请选择任务类型',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!starttime) {
            wx.showToast({
                title: '请选择开始时间',
                icon: 'none',
                duration: 1000
            })
        }
        else if (!endtime) {
            wx.showToast({
                title: '请选择结束时间',
                icon: 'none',
                duration: 1000
            })
        }
        else if (starttimeTemp > endtimeTemp) {
            wx.showToast({
                title: '时间不合法',
                icon: 'none',
                duration: 1000
            })
        }
        else if (csIndex==0) {
            wx.showToast({
                title: '请选择完成次数',
                icon: 'none',
                duration: 1000
            })
        }
        else {  
            var goods = that.data.goods;
            var subgoodsid=[];
            
            for (var i = 0; i < goods.length;i++){
                subgoodsid.push(goods[i].id)
            }    
            
            subgoodsid=JSON.stringify(subgoodsid)
                       
            network.POST({
                url: 'v16/task-public/set-task',
                params: {
                    "mobile": app.userInfo.mobile,
                    "token": app.userInfo.token,
                    "bu_id": uid,
                    "taskid": typeIndex,                           
                    "startdate": starttime,
                    "enddate": endtime,
                    "all_sum": csIndex,
                    "goods_ids": subgoodsid
                    // "goods_ids":arr,
                },
                success: function (resnew) {
                    wx.hideLoading();
                    if (resnew.data.code == 200) {
                        wx.setStorage({
                            key: 'goods',
                            data: '',
                        })
                        wx.setStorage({
                            key: 'goodsids',
                            data: '',
                        })
                        wx.navigateBack({
                            
                        })
                    } else {
                        wx.showToast({
                            title: resnew.data.message,
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
    },
    
})