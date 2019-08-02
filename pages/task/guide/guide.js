// pages/task/guide/guide.js
const network = require("../../../utils/network.js");
const app = getApp();
Page({

    data: {
        tabs: [{ index: 0, title: '功能介绍', width: '50%' }, { index: 1, title: '使用指南', width: '50%' }],
        curIndex: 0,
    },

    onLoad: function (options) {

    },

    onShow: function () {

    },
    swiTab: function (e) {
        var a = e.currentTarget.dataset.index;
        this.setData({
            curIndex: a,
            showEmpty: false
        });
        // console.log(a)
        if (a == 1) {
            // this.getRight(false, this.data.pageRight);
        }
        else if (a == 0) {
            // this.getLeft(false, this.data.pageLeft);
        }
        
    },
    getLeft:function(){
        
    }
})