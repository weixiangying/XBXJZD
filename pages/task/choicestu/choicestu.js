// pages/task/choicestu/choicestu.js
const network = require("../../../utils/network.js");
const app = getApp();
Page({

    data: {
        list:[],
    },
    onLoad: function (options) {
        var that=this;
        that.getStudentListNew();
    },

    onShow: function () {

    },
    getStudentListNew: function () {
        var that = this;
        network.getStudentList(function (res) {

            if (res.data.code == 200) {
                var a = res.data.data[0].list;
                // console.log(a)               
                    that.setData({
                        list: a,                                             
                    })
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1000
                });
            }
        });


    },
    tz_task:function(e){
        var that=this;
        wx.setStorage({
            key: 'choicestu_task',
            data: e.currentTarget.dataset.uid,
        })
        wx.switchTab({
            url: '/pages/task/task',
        })
    }
})