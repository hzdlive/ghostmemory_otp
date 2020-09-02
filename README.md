# OTP

#### 介绍

基于时间戳算法（TOTP）的动态验证码微信小程序，兼容Google Authenticator二步验证。

#### 软件架构

基于MinaOTP二次开发，使用小程序云开发实现云端数据备份。


#### 软件功能

- 生成TOTP动态验证码口令
- 支持扫码或手动录入数据
- 支持编辑服务和帐号信息
- 支持手动删除已存在记录
- 支持云端备份与恢复数据
- 支持倒计时红色闪烁提醒

#### 使用说明

请使用微信扫码**打开小程序** ，点击添加，扫描二维码添加测试数据。

![小程序码](https://images.gitee.com/uploads/images/2020/0824/162015_16d7b5d8_21964.jpeg "小程序码.jpg") 
![测试二维码](https://images.gitee.com/uploads/images/2020/0902/093130_a25d3829_21964.png "b57b6e45240cdf492400d07a0007abe1.png")


#### 功能预览

![功能预览](https://images.gitee.com/uploads/images/2020/0825/163947_84f07ef0_21964.png "功能预览.png")


#### 部署教程

1. 下载本项目或者``` git clone https://gitee.com/ghostmemory/otp.git ```
2. 将项目导入微信小程序开发工具
3. 修改```/project.config.json``` 中的 ```appid: '你申请的小程序appid' ```

![导入项目](https://images.gitee.com/uploads/images/2020/0826/094614_ff815457_21964.png "导入.png")


4. 创建云数据库```otp、user、loginlog```

![创建集合](https://images.gitee.com/uploads/images/2020/0826/095806_1c7c7d75_21964.png "新建.png")

5. 上传云函数user

![部署云函数](https://images.gitee.com/uploads/images/2020/0826/095634_ec09226a_21964.png "部署.png")


#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

## LICENSE

[MIT](https://gitee.com/ghostmemory/otp/blob/master/LICENSE)
