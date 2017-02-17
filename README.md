# blog-react-native

### 前言

Blog https://github.com/mhbseal/blog 的react-native版,JS架构部分基本同web版。  
APP线上下载地址：https://pan.baidu.com/s/1skP4nu9

### 准备

API依赖blog的be部分,如果想本地服务,则先看这里blog(web版)搭建API服务(并启动),
也可以直接用线上的API,修改rn/src/config/dev.js文件即可。
安装所需的开发工具,例如xcode,android studio等,本项目于mac os下开发,win环境下未实践。

### 运行
    
    git clone https://github.com/mhbseal/blog-react-native.git  // 仓库
    cd rn && npm install  // 安装
    npm run ios  // 启动ios(也可进xcode中启动)
    npm run emulator // 启动android模拟器,命令启动android需要先手动启动模拟器(第一次需要android studio模拟器中配置)
    npm run android  // 启动android(也可进android studio中启动)
    
    
### 说明

本项目,不是纯react—native版,考虑到工作中的现实情况,一般混合开发较多,
所以ios部分是在xcode中新建一个项目,然后rn集成进去,
同理android部分在android studio新建一个项目,然后rn集成进去,
native部分、rn部分包含了两部分的互相跳转,详见代码,界面中未展示。

### 待优化、已知Bug

1.StatusBar的问题  
1)iOS  原生->RN->原生->RN(pop)，StatusBar消失了  
2)android RN->原生->RN，StatusBar hidden=true不管用了  
2.android下，原生->RN1->RN2->原生->RN1->RN2->原生->RN2(pop)->RN1(pop)->原生(pop)->RN2(pop)->原生(pop，这里出现bug，本应该到RN1)  
3.开启右划回退，当页面正在请求即将渲染的时候（计算密集），右划出现假死状态  
4.热更新的引入  
5.android中run-bundle命令只能从MainActivity进去，新版本RN已经增加了参数支持非MainActivity，待升级RN

### 更新日志

**v0.1.1（2017-00-00）**  
完善架构、脚手架、修复bug

1.android下,redux调试无效的问题  
2.v0.1.0 bug.2,remote-redux-devtools工具引起的问题,多次跳转关闭工具即可,详见/rn/src/redux/create.js  
3.fix v0.1.0 bug.1.1
4.v0.1.0 bug.1.2,原因不详,暂时可以通过静态方法setHidden解决
5.v0.1.0 优化.5,暂时手动copy最新react-native/local-cli/runAndroid/runAndroid.js
6.升级rn到v0.41.2

**v0.1.0（2017-02-13）**  
react-native实现blog(web版)
