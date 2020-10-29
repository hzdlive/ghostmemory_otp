// pages/index/index.js
let TOTP = require('../../utils/totp')
let util = require('../../utils/util')
let digits = []
let tokens = []
let percentage = 0
let timer = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tokens: digits,
    animationData: {},
    warn:false
  },

  /**
   * 转发
   */
  onShareAppMessage: function (res) {
    return {
      title: '便捷的二步验证小程序',
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

  /**
   * 页面显示时载入
   */
  onShow: function (options) {
    let self = this
    // let test = TOTP.now("J22U6B3WIWRRBTAV")
    // console.log("J22U6B3WIWRRBTAV")
    // console.log(test)
    let sc_width = 0
    // 获取屏幕宽度
    wx.getSystemInfo({
      success: function(res) {
        sc_width = res.windowWidth
      },
    })

    // 定义动画
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear",
      delay: 0,
    })
    // 每秒更新百分比
    timer = setInterval(function () {
      // 更新动画
      let i = util.getSeconds() % 30 + 1
      animation.width((sc_width/30 * i)).step()
      self.setData({
        animationData: animation.export()
      })
      if (1 == i) {
        self.updateDigits(self)
      }
      self.updateWarnStyle(i);
    }, 1000)

    self.updateDigits(self);
    self.updateWarnStyle(0);
  },

  /**
   * 编辑或删除token
   */
  tokenOperation: function (e) {
    console.log(e.currentTarget.id)

    wx.showActionSheet({
      itemList: ["复制","编辑", "删除"],
      itemColor: '#000000',
      success: function(res) {
        if(0 == res.tapIndex){
          wx.setClipboardData({  data: digits[e.currentTarget.id].secret  } );

        }
        else if (1 == res.tapIndex) {
          console.log("编辑" + e.currentTarget.id)
          wx.navigateTo({
            url: '../edit/edit?token_id='+e.currentTarget.id
          })
        } else if (2 == res.tapIndex) {
          console.log("删除" + e.currentTarget.id)
          util.removeToken(e.currentTarget.id)
        }
      }
    })
  },
  

  /**
   * 显示操作菜单
   */
  showActionSheet: function () {
    wx.showActionSheet({
      itemList: ["扫描二维码", "手动输入"],
      itemColor: '#000000',
      success: function(res) {
        if (0 == res.tapIndex) {
          wx.scanCode({
            onlyFromCamera: false,
            success: function(res) {
              console.log(res.result)
              let url_params = util.parseURL(res.result)
              //let url_params = url_obj.params
              if (null == url_params) {
                console.log("invalid secret")
                wx.showModal({
                  content: '无效二维码',
                  showCancel: false,
                  confirmText: '返回',
                  confirmColor: '#ff9c10',
                })
              } else {
                let values = {
                  issuer: url_params.issuer==null?"UNKNOWN":url_params.issuer,
                  remark: url_params.remark==null?"UNKNOWN":url_params.remark,
                  secret: url_params.secret,
                }
                util.addToken(values, "scan")
                console.log(values)
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        } else if (1 == res.tapIndex) {
          wx.navigateTo({
            url: '../form/form',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {
        console.log("显示操作菜单错误")
      },
      complete: function(res) {},
    })
  },

  /**
   * 显示导出菜单
   */
  gotoInfo: function () {
    // 获取缓存数据
    wx.getStorage({
      key: 'token',
      success: function (res) {
        tokens = res.data
        // 复制数据至剪切板
        wx.setClipboardData({
          data: JSON.stringify(tokens),
          success: function (res) {
            wx.navigateTo({
              url: '../info/info',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  /**
   * 更新digits
   */
  updateDigits: function (self) {
    // 获取缓存数据
    wx.getStorage({
      key: 'token',
      success: function (res) {
        tokens = res.data
        digits = []
        for (let i = 0; i < tokens.length; i++) {
          let secret = TOTP.now(tokens[i].secret)
          let digit_obj = {
            issuer: tokens[i].issuer,
            remark: tokens[i].remark,
            secret: secret
          }
          digits.push(digit_obj)
        }
        self.setData({
          tokens: digits
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  updateWarnStyle(i){
    this.setData({warn:(i>24&&i%2==1)?true:false})
  },
  onHide(){
    if(timer){
      clearInterval(timer);
    }
  },
})