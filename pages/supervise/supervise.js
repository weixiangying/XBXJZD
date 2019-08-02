// page/supervise/supervise.js
var network = require("../../utils/network.js");
const app = getApp();

var dates = null;
var count = null;

// var uid='';
var uid ='';
Page({

    data: {
        arr: [],
        sysW: null,
        lastDay: null,
        firstDay: null,
        weekArr: ['日', '一', '二', '三', '四', '五', '六'],
        year: null,

        sectedDate:'',

        changeCss: 1,
    },
    //获取日历相关参数
    dataTime: function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var months = date.getMonth() + 1;
       
        
        this.data.year = year;//获取现今年份        
        this.data.month = months;//获取现今月份       
        this.data.getDate = date.getDate();//获取今日日期       
        var d = new Date(year, months, 0);//最后一天是几号
        this.data.lastDay = d.getDate();      
        let firstDay = new Date(year, month, 1); //第一天星期几
        this.data.firstDay = firstDay.getDay();

        this.canlendarList();

        this.setData({
          startDate: year - 2 + '-' + months,
          endDate: year + 5 + '-' + months,
        })

      // var date = new Date();
      // var curtYear = date.getFullYear();
      // var curtMonth = date.getMonth();     
      // var curtDate = date.getDate();
     


    },

    onLoad: function (options) {
        this.dataTime();
        this.initDate();
        this.initDateScroPos();

        this.setData({
            foroneline: app.systemInfo.windowWidth - app.systemInfo.windowWidth / 750 * 274,
            foroneline2: app.systemInfo.windowWidth - app.systemInfo.windowWidth / 750 * (274+31)
        })

        uid=options.uid;
        // uid = 164820;
        this.getSupervise();

        var that=this;
        var query2 = wx.createSelectorQuery();
        query2.select('#showone').boundingClientRect()
        query2.exec(function (res) {
            //   console.log(res[0])
            //   console.log(res[0].top)
            // console.log(res)
            var windowHeight = app.systemInfo.windowHeight;
            var windowWidth = app.systemInfo.windowWidth;
            that.setData({
                accordingtopbox: res[0].height - windowWidth / 750 * 234,
            })
            // console.log(that.data.accordingtopbox)
        })
        
    },
    getSupervise() {
        var that = this;
        var submitdate='';

        var year = that.data.year;
        var month = that.data.month;
        var day = that.data.getDate;
        var sectedDate=that.data.sectedDate
        if (sectedDate==''){
            submitdate = year + '-' + month + '-' + day;
        }
        else{
            submitdate = year + '-' + month + '-' + sectedDate;
        }
        

        // console.log(submitdate)
        network.POST({
            url: 'v16/supervise/list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "bu_id": uid,
                "date": submitdate
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    that.setData({
                        // superviselist: a,
                        // superviselength: a.length,
                        biji:a.biji,
                        bijilength: a.biji.length,
                        dingwei:a.dingwei,
                        dingweilength: a.dingwei.length,
                        licai: a.licai,
                        licailength: a.licai.length,
                        xuexi: a.xuexi,
                        xuexilength: a.xuexi.length,
                        tiwen: a.tiwen,
                        tiwenlength: a.tiwen.length,
                    });
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
    canlendarList: function () {
        //根据得到今月的最后一天日期遍历 得到所有日期
        for (var i = 1; i < this.data.lastDay + 1; i++) {
            this.data.arr.push(i);
        }        
        this.setData({
            sysW: app.systemInfo.windowHeight / 13,
            marLet: this.data.firstDay,
            arr: this.data.arr,
            year: this.data.year,
            getDate: this.data.getDate,
            month: this.data.month
        });
      
    },

    pickerChange: function (e) {
        // console.log(e)
        var a = e.detail.value;
        // curtYear = a.split('-')[0];
        // curtMonth = parseInt(a.split('-')[1]) - 1;
        // curtMonthStr = a.split('-')[1];
        this.setData({
            arr: [],
        });
        var date = new Date();
        var year = a.split('-')[0];
        var month = a.split('-')[1] - 1;
        var months = a.split('-')[1];

        

        this.data.year = year;
        this.data.month = months;
        this.data.getDate = date.getDate();
        var d = new Date(year, months, 0);
        this.data.lastDay = d.getDate();
        let firstDay = new Date(year, month, 1);
        this.data.firstDay = firstDay.getDay();

        this.canlendarList();


        this.initDate();
        this.initDateScroPos();

        // console.log(this.data.year)
        // console.log(this.data.month)
        // console.log(this.data.getDate)
    },

    //
    initDate: function () {
        var a = this.data.month;
        var b=this.data.year;
        // console.log(a)
        if ([1, 3, 5, 7, 8, 10, 12].indexOf(a) != -1) {
            count = 31;
        } else if ([4, 6, 9, 11].indexOf(a) != -1) {
            count = 30;
        } else {
          if ((b % 4 == 0) && (b % 100 != 0 || b % 400 == 0)) {
                count = 29;
            } else {
                count = 28;
            }
        }
        // console.log(count);

        dates = [];
        for (let i = 1; i <= count; i++) {
            this.getWeek(i);
        }
        this.setData({
            dates: dates
        });
        // console.log(this.data.dates)
    },
    getWeek: function (i) {
      
        var day = new Date(this.data.year, this.data.month-1, i).getDay();
        // console.log(day)
        var w = '';
        switch (day) {
            case 0:
                w = '日';
                break;
            case 1:
                w = '一';
                break;
            case 2:
                w = '二';
                break;
            case 3:
                w = '三';
                break;
            case 4:
                w = '四';
                break;
            case 5:
                w = '五';
                break;
            case 6:
                w = '六';
                break;
        }
        dates.push({ d: i, w: w });
    },
    initDateScroPos: function () {
        var a = parseInt(this.data.getDate / 7) - .3;
        // console.log(a, app.systemInfo.windowWidth);
        var b = a * app.systemInfo.windowWidth;
        this.setData({
            scrollLeft: b
        });

    },
    sectDate: function (e) {          
      var a = e.currentTarget.dataset;
      this.setData({
        sectedDate: a.dt
      });  
      var that=this;
        // console.log(that.data.sectedDate)   
        that.getSupervise();
    },
    topSectData:function(e){
        var that=this;
        that.setData({
            sectedDate: e.currentTarget.dataset.topdata
        });
        that.getSupervise();
    },
    goBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    onPageScroll: function (ev) {
        var that = this;
        // console.log(ev.scrollTop)
        if (ev.scrollTop < that.data.accordingtopbox) {
            that.setData({
                changeCss: 1
            })
        }
        else {
            that.setData({
                changeCss: 2
            })
        }
    },
})
