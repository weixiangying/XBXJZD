// pages/my/school/school.js
const app = getApp();


Page({
    data: {
        schoolId: ''
    },
    onLoad(options) {
        this.setData({
            schoolId: options.schoolid
        });
        // console.log(this.data.schoolId)
    }
})