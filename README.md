# OTP

#### 介绍
OTP小程序

#### 软件架构
基于小程序云开发实现的OTP动态验证码，采用MinaOTP二次开发，支持Google Authenticator。


#### 软件功能

- 计算TOTP二步验证动态口令
- 扫码或手动输入添加secret
- 编辑服务和帐号备注信息
- 手动删除已存在的secret
- 云端备份与恢复secret
- 倒计时5秒红色闪烁提醒

#### 使用说明

使用微信扫码体验

![小程序码](https://images.gitee.com/uploads/images/2020/0824/162015_16d7b5d8_21964.jpeg "gh_508ca98f3bfb_430.jpg")


#### 部署教程

1. 下载本项目或者``` git clone https://gitee.com/ghostmemory/otp.git ```
2. 将项目导入微信小程序开发工具 
3. 修改```/project.config.json``` 中的 ```appid: '你申请的小程序appid' ```
4. 创建云数据库```otp、user、devicelog```,
5. 上传云函数user

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

## LICENSE

[MIT](https://gitee.com/ghostmemory/otp/blob/master/LICENSE)
