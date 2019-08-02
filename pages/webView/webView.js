// pages/webView/webView.js
const network = require("../../utils/network.js");
const app = getApp();

Page({
    data: {
        src: ''
    },
    onLoad: function (options) {
        // console.log(options);
        var that = this;
        
        that.setData({
            src: options.src
        });
           
        // console.log(that.data.src)
    },
    
    
})