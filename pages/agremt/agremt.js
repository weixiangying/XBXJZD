const app = getApp();
Page({
  data: {
  
  },
  onLoad: function (options) {
      this.compontNavbar = this.selectComponent("#compontNavbar");
      this.setData({
         
          idname: app.idname
      })
  }
})