<div align="center">
  <img width="100%" src="https://user-images.githubusercontent.com/15929863/120800677-cbbc7000-c572-11eb-97e0-622d616ece71.png" alt="logo">
</div>

<br>

![mongoose](https://img.shields.io/badge/mongoose-5.12.10-brightgreen)
![KoaJS](https://img.shields.io/badge/koa-2.13.1-brightgreen)
![typescript](https://img.shields.io/badge/typescript-4.2.4-brightgreen)
![qiniu](https://img.shields.io/badge/qiniu-7.3.2-brightgreen)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

<br>

## :tada:技术栈

- #### Koa2： Koa -- 基于 Node.js 平台的下一代 Web 开发框架。
- #### TypeScript：通过在JavaScript的基础上添加静态类型定义构建而成的开源编程语言。
- #### Mongoose： 为node.js设计的优雅mongodb对象模型库。
- #### Redis: 连接Redis数据库快捷类库。

<br>

## :art:运行环境

- #### MongoDB Atlas: [MongoDB提供免费云数据库Mongodb Atlas， 主要做数据储存，支持免费512M](https://www.mongodb.com/)
- #### RedisLab：[RedisLab提供30M免费储存空间，做消息队列发送email使用](https://app.redislabs.com/#/login)
- #### Kodo：[七牛云对象储存Kodo提供免费10G空间，主要图片、视频资源储存， 需实名认证](https://www.qiniu.com/)
- #### Docker镜像： [镜像主要托管在阿里云镜像服务仓库](https://cn.aliyun.com/ss/?k=%E5%AE%B9%E5%99%A8%E6%9C%8D%E5%8A%A1)
- #### Jenkins：[Jenkins主要做自动化部署打包的服务镜像](https://www.jenkins.io/)

<br>

## :hammer:环境搭建指引

- #### MongoDB Atlas：[免费试用MongoDB云数据库 （MongoDB Atlas）教程](https://www.cnblogs.com/xybaby/p/9460634.html)
- #### RedisLab: [Redis Labs : 永久免费提供30M Redis 申请方法](https://wangdalao.com/2750.html)
- #### 七牛云：[七牛云存储申请成功](https://www.kancloud.cn/tl18615640582/sfxsdvcxf/2003877)
- #### 阿里轻量级服务器：[轻量应用服务器](https://cn.aliyun.com/product/swas)
- #### jenkins： [实战笔记：Jenkins打造强大的前端自动化工作流](https://juejin.cn/post/6844903591417757710)
- #### Docker/nginx：[Docker教程：使用Docker容器运行Nginx并实现反向代理](Docker教程：使用Docker容器运行Nginx并实现反向代理)

<br>

> 注意事项：中国大陆如果想要域名访问绑定的主机，域名需要备案。如果购买中国香港节点，不需要走备案审核流程，比较方便。

<br>

## :sparkles: 流程图
![process](https://user-images.githubusercontent.com/15929863/120813982-0200ec00-c581-11eb-9c60-8cece349c33c.png)

## :memo:目录结构

开发目录如下面解释所示：
```bash
├── app.ts 程序入口
├── commitlint.config.js //git hooks校验规则
├── config  //配置文件目录
│   ├── config.ts
│   └── db.ts
├── controller //控制器目录
│   ├── article.ts
│   ├── comment.ts
│   ├── common.ts
│   └── user.ts
├── docker-compose.yml 
├── dockerfile 
├── model  模型定义目录
│   ├── article.ts
│   ├── comment.ts
│   └── user.ts
├── package.json
├── package-lock.json
├── README.md
├── routes 路由目录
│   ├── article.ts
│   ├── comment.ts
│   ├── common.ts
│   └── user.ts
├── tsconfig.json
├── utils 帮助工具函数目录
│   ├── auth.ts // 权限校验函数
│   ├── email.ts // 邮件发送
│   ├── middleware.ts // 中间件配置
│   ├── oss-upload.ts // 七牛云对象储存函数工具
│   └── tools.ts // 帮助函数
└── yarn.lock

```
## :sparkles:先前准备
需要相应的账号密码填写
```bash
# 监听端口
PORT=3000

# JWT加密秘钥
JWT_SECRET= xxx

# 数据库地址
DATABASE_URL=xxx

# 七牛云 ACCESS_KEY
ACCESS_KEY=xxx

# 七牛云 SECRET_KEY 
SECRET_KEY=xxx

# 七牛云 OSS-Space
UPLOAD_SPACE = xxx

# 域名1地址
DOMAIN=xxxx

# 网易邮箱发送
EMAIL=xxx@163.com
EMAILPASS=xxx

# redisLab
REDISHOST=xxx
REDISPORT=17781
REDISPASS=xxx
REDISPASS=8wLDeSdq6d522yY0BEVDSCiYp7QHw0pB
```
## :rocket:运行命令

```bash
// 安装依赖
yarn

// 开发环境运行
yarn watch-server

// 打包部署环境产物
yarn build

// 运行生产环境资源
yarn serve

// 检查代码风格
yarn lint

//停止运行
yarn stop
```
## :bulb:参考文献

- MongoDB Atlas：[免费试用MongoDB云数据库 （MongoDB Atlas）教程](https://www.cnblogs.com/xybaby/p/9460634.html)
- RedisLab: [Redis Labs : 永久免费提供30M Redis 申请方法](https://wangdalao.com/2750.html)
- 七牛云：[七牛云存储申请成功](https://www.kancloud.cn/tl18615640582/sfxsdvcxf/2003877)
- 阿里轻量级服务器：[轻量应用服务器](https://cn.aliyun.com/product/swas)
- jenkins： [实战笔记：Jenkins打造强大的前端自动化工作流](https://juejin.cn/post/6844903591417757710)
- Docker/nginx：[Docker教程：使用Docker容器运行Nginx并实现反向代理](Docker教程：使用Docker容器运行Nginx并实现反向代理)
