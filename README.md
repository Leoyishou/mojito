# MojitoTranslate 前端服务

这是MojitoTranslate浏览器扩展的配套前端服务，用于处理用户认证和与扩展通信。

## 功能

- Google账号登录认证
- 与浏览器扩展通信
- 用户配置文件管理

## 部署指南

### 使用Firebase Hosting部署

1. 安装Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. 登录Firebase:
   ```
   firebase login
   ```

3. 初始化Firebase项目(如果尚未初始化):
   ```
   firebase init
   ```
   - 选择"Hosting"服务
   - 选择已存在的项目"mojito-4369e"
   - 设置public目录为"public"
   - 配置为单页应用：否

4. 部署应用:
   ```
   firebase deploy
   ```

部署后，应用将可在以下URL访问:
- https://mojito-4369e.web.app
- https://mojito-4369e.firebaseapp.com

## 项目结构

```
frontend/
├── public/              # 静态资源目录
│   ├── index.html       # 主页
│   ├── auth.html        # 扩展授权页面
│   ├── css/
│   │   └── styles.css   # 样式表
│   └── js/
│       ├── auth.js       # 主页脚本
│       └── extension-auth.js  # 扩展授权脚本
└── firebase.json        # Firebase配置
```

## 与扩展通信

前端应用与扩展的通信使用Chrome扩展通信API。当用户在前端完成登录后，应用会：

1. 生成用户凭证令牌
2. 使用`chrome.runtime.sendMessage`将用户数据发送到扩展
3. 扩展接收数据并保存用户凭证
4. 用户自动重定向回扩展

## 安全注意事项

- 只允许从此域名发送的消息与扩展通信
- 用户令牌仅在用户授权后生成
- 身份验证使用Firebase Auth进行处理，确保安全 