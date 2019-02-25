## 开发所需软件

### 1. Git

> 版本管理工具。用于下载项目的代码和在开发时进行代码和文档的版本管理。

  [安装说明](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

### 2. NodeJS

> 前端项目运行的基础环境。(使用8.x版本)

#### 安装包下载地址

  [Windows 64位](https://nodejs.org/dist/latest-v8.x/node-v8.15.0-x64.msi)
  
  [Windows 32位](https://nodejs.org/dist/latest-v8.x/node-v8.15.0-x86.msi)
  
  [MacOS](https://nodejs.org/dist/latest-v8.x/node-v8.15.0.pkg)

#### 安装说明
  
  [链接](http://www.runoob.com/nodejs/nodejs-install-setup.html)

#### npm镜像设置

> 解决访问国外官方源服务器过慢的问题

``` bash
// 使用国内镜像
npm config set registry https://registry.npm.taobao.org
// 配置后可通过下面方式来验证是否设置成功
npm config get registry
```

### 3. Yarn

> 用于管理第三方依赖

  [安装包下载地址](https://yarnpkg.com/lang/zh-hans/docs/install/)

### 4. VSCode

> Visual Studio Code (简称 VS Code / VSC) 是一款免费开源的现代化轻量级代码编辑器，用于开发前端页面

  [安装包下载地址](https://code.visualstudio.com/download)
  
#### 开发常用插件安装

  1. 安装 `Settings Sync` 插件。
  2. 安装后点击VS Code上方菜单的 `查看`，然后选择 `命令面板`。
  3. 在显示的命令面板内输入 `sync`。
  4. 将光标移动至 `Sync: 高级选项` 并回车。
  5. 将光标移动至 `从公开的Gist下载设置` 并回车。
  6. 点击VS Code上方菜单的 `查看`，然后选择 `命令面板`。
  7. 在显示的命令面板内输入 `sync`。
  8. 将光标移动至 `Sync: 下载设置` 并回车。
  9. 在显示的 `Enter Gist ID` 输入框中输入 `cc2af0974df9ffb0069f149e0791f9f0`，按回车键。
  10. 此时插件开始自动进行下载（根据网络情况下载所需时间有所不同，大约需5 ～ 10分钟），在下载成功后自动弹出的对话框中依据提示重新启动VS Code。
  11. VS Code重新启动后，点击左侧扩展菜单项，可查看已启动扩展（Vetur等）

### 5. Github App

> 用于从公司内网Github上传和下载代码

[安装说明](https://w3.ibm.com/help/#/article/github_ent_ibm/github_setup?requestedTopicId=github_ibm)