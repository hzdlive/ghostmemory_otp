// pages/mine/mine.js
//let util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    uploading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  uploadData(){//数据备份
    console.log("uploadData");
    //util.uploadToken(token);
    let self = this;
    
    wx.showModal({
      title: '数据备份',
      content: '确定备份本地数据到云端？',
      confirmText: '确定',
      confirmColor: '#ff9c10',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          self.setData({uploading:true});
          const token = wx.getStorageSync('token');
          if(token && token.length > 0){
            const db = wx.cloud.database();
            let data = {token};
            data.num = token.length;
            data.type = "man";
            data.createtime = new Date().getTime();
            data.createtimeText = new Date().toLocaleString();
            db.collection('otp').add({
              data: data
            }).then(res => {
              console.log(res);
              self.setData({uploading:false});
              if(res && res._id){
                console.log(res._id);
                wx.showToast({
                  title: '数据备份成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
            .catch(err =>{
              self.setData({uploading:false});
              console.log("uploadToken error",err)
              wx.showToast({
                title: '数据备份失败，请重试。',
                icon: 'none',
                duration: 2000
              })
            })
          }else{
            self.setData({uploading:false});
            wx.showToast({
              title: '未发现本地数据',
              icon: 'none',
              duration: 2000
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  restoreData(){//数据恢复
    console.log("restoreData");
    
    let self = this;
    self.setData({loading:true});
    const db = wx.cloud.database();
    db.collection('otp').orderBy('createtime', 'desc').limit(1).get({
      success: function(res) {
        self.setData({loading:false})
        console.log(res.data)
        if(res && res.data && res.data[0]){
          const data = res.data[0];
          const token = data.token;
          if(data.num  > 0){
            const text = `发现${data.num}条数据，确定使用云端数据覆盖本地记录？`
            wx.showModal({
              title: '云端数据恢复',
              content: text,
              confirmColor: '#ff9c10',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.setStorage({
                    key: 'token',
                    data: token,
                    success: function (res) {
                      console.log(res)
                      wx.showToast({
                        title: '数据恢复成功',
                        icon: 'success',
                        duration: 2000
                      })
                    },
                    fail: function (res) {
                      console.log(res)
                    },
                  })

                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{
            wx.showToast({
              title: '未发现备份数据',
              icon: 'none',
              duration: 2000
            })
          }
        }else{
          wx.showToast({
            title: '未发现备份数据',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  goAuth(){
    console.log("auth")
    //console.log()
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          console.log(res)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  // diffToken(localToken,cloudToken){
  //   if(cloudToken){
  //   }
  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 转发
   */
  onShareAppMessage: function (res) {
    return {
      title: '支持云端备份的动态验证码',
      path: '/pages/index/index',
      imageUrl: '/images/share.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})