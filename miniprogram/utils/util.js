let TOTP = require('totp')

// 获取当前时间秒
function getSeconds() {
  let now = new Date()
  return now.getSeconds()
}

// 解析url 
function parseURL(uri) {
  if (typeof uri !== 'string' || uri.length < 7) return null;
  let source = decodeURIComponent(uri);
  let data = source.split("otpauth://totp/")[1];
  if(data==null) return null;
  /**
   * 数据截断
   */
  let isHaveIssuer = data.split("?")[0].indexOf(":") != -1 && data.split("?")[0].indexOf(":") != 0 ;
  let remark = "";
  if (isHaveIssuer) {
    console.log(data);
    remark = data.split("?")[0].split(":")[1];
  } else {
    console.log(data);
    remark = data.split("?")[0];
  }
  let issuer = data.split("issuer=")[1];
  let secret = data.split("?")[1].split("&")[0].split("=")[1]
  if(secret == null) return null;
  return { remark, issuer, secret };
}

// 添加token
function addToken(values, path) {
  let token = []
  if ("" == values.secret) {
    wx.showModal({
      content: '忘记KEY了？',
      showCancel: false,
      confirmText: '返回',
      confirmColor: '#ff9c10',
    })
  } else if (null == TOTP.now(values.secret)) {
    console.log(values.secret)
    console.log(TOTP.now(values.secret))
    wx.showModal({
      content: 'KEY不合法',
      showCancel: false,
      confirmText: '返回',
      confirmColor: '#ff9c10',
    })
  } else {
    let token_obj = {
      issuer: values.issuer,
      remark: values.remark,
      secret: values.secret
    }
    console.log(token_obj)
    // 获取缓存的token数组
    wx.getStorage({
      key: 'token',
      success: function (res) {
        token = res.data
        // 更新缓存的token信息
        token.push(token_obj)
        // 更新缓存
        wx.setStorage({
          key: 'token',
          data: token,
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {
            console.log(res)
          },
        })
        uploadToken(token);

      },
      fail: function (res) {
        // 缓存中不存在token时获取初始数组
        token.push(token_obj)
        wx.setStorage({
          key: 'token',
          data: token,
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {
            console.log(res)
          },
        })
        uploadToken(token);
      },
      complete: function () {
        if ("man" == path) {
          wx.navigateBack({
            delta: 1,
          })
        } else if ("scan" == path) {
          wx.reLaunch({
            url: 'index',
          })
        }
      }
    })
  }
}

// 删除token
function removeToken(token_id) {
  let token = []
  wx.showModal({
    content: '云端该记录也将同步删除，确定删除吗?',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '#929292',
    confirmText: '确定',
    confirmColor: '#ff9c10',
    success: function(res) {
      if (res.confirm) {
        // 确定删除
        wx.getStorage({
          key: 'token',
          success: function(res) {
            token = res.data
            // 删除指定一位
            token.splice(token_id, 1)
            // 重新存储
            wx.setStorage({
              key: 'token',
              data: token,
              success: function(res) {
                console.log(res)
              },
              fail: function(res) {
                console.log(res)
              }
            })
            uploadToken(token);
          },
          complete: function(res) {
            wx.reLaunch({
              url: 'index',
            })
          }
        })
      } else if (res.cancel) {
        console.log("cancelled")
      }
    }
  })
}

function uploadToken(token){
  const db = wx.cloud.database();
  const _ = db.command;
  let data = {token};
  data.num = token.length;
  data.type = "auto";
  data.createtime = new Date().getTime();
  data.createtimeText = new Date().toLocaleString();
  db.collection('otp').add({
    data: data
  }).then(res => {
    console.log(res);
    if(res && res._id){
      console.log(res._id);
      //const id = res._id;
      // db.collection('otp').where({
      //   _id: _.neq(id)
      // }).remove()
    }
  })
  .catch(err =>{
    console.log("uploadToken error")
    console.log(err)
    wx.showToast({
      title: '同步云端失败，请手动备份',
      icon: 'none',
      duration: 2000
    })
  })
}

module.exports = {
  getSeconds: getSeconds,
  addToken: addToken,
  removeToken: removeToken,
  parseURL: parseURL,
  uploadToken:uploadToken
}
