// pages/binding/binding.js
var app = getApp();
Page({

  data: {

  },

  onLoad: function (options) {
      this.setData({
          idname:app.idname
      })
  },
    tz_next: function (e) {
        // mytype
        wx.navigateTo({
            url: '/pages/binding/form/form?mytype=' + e.currentTarget.dataset.mytype
        })
    },
})