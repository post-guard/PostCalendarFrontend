# 邮历

> 邮历，一路有你

北京邮电大学2021级数据结构课程设计大作业（邮历）前端仓库，
后端仓库在[post-guard/PostCalendarBackend](https://github.com/post-guard/PostCalendarBackend)。

本次大作业的要求为实现一个学生日程管理系统。

## 特点

- 高级的校园地图编辑器
- 令人~~为之一振~~的闹钟音乐
- 花费两周半匠心打造的可靠~~大嘘~~页面

## 开发

使用`Vue 3+Vite`开发，使用`pnpm`作为项目的包管理器，使用`Ant Design`作为组件库。

项目中添加了`Typescript`支持，建议使用`Typescript`以获得更好的编程和维护体验。

### 初始化项目

安装程序中需要使用的依赖：

```shell
pnpm install
```

启动开发服务器（具有热重载功能）：

```shell
pnpm dev
```

编译为工程打包文件：

```shell
pnpm build
```

### 设置后端地址

项目中`HTTP API`终结点统一以`postcalendarapi/`起始，因此需要使用反向代理工具将后端接口代理至该路径。
如果是调试项目，可以修改`vite.config.ts`中的`proxy`字段下的地址。

项目中`Websocket API`使用的地址为绝对地址，需要在代码文件中手动修改，建议使用查找-替换功能进行一键修改。
~~我承认在代码里面把地址写死非常粪，但是我确实没有找到更好的办法。~~

### 开发使用的IDE

- `VSCode + Volar`

- `Jetbrains Webstorm`

## 支持

如果您在学习或者是抄袭的过程中发现了问题，我们十分欢迎您提出。
您可以通过发起`issue`或者是发送电子邮件的方式联系到我们。
