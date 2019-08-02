const network = require("../../../utils/network.js");
const app = getApp();
var remark = '';
var id = '';

Page({
    data: {
        base: '../../../'
    },
    onLoad: function(options) {
        id = options.id;
        this.compontNavbar = this.selectComponent("#compontNavbar");
    },
    onShow: function() {

    },
    inputFn(e){
        remark = e.detail.value.replace(/^\s*|\s*$/, '');
    },
    save(){
        var that = this;
        if(remark){
            network.setRemark(remark, id, function(res){
                // console.log(res);
                wx.navigateBack({
                    delta: 1
                });
            });
        }else{
            wx.showToast({
                title: '请填写备注',
                icon: 'none'
            })
        }
    },
    onUnload: function() {

    }
})