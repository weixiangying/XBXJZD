// pages/my/aboutus/aboutus.js
const app = getApp();
Page({

   
  onLoad: function (options) {
      this.setData({
          version:app.version,
          idname: app.idname,
          tel: app.contactTel
      })
  },
    makePhone(e) {
        wx.makePhoneCall({
            phoneNumber: app.contactTel
        })
    },
})