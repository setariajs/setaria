## 在 VS Code 中调试

### 从 VS Code 启动应用

点击在 Activity  Bar 里的 Debugger 图标来到 Debug 视图，然后点击那个齿轮图标来配置一个 launch.json 的文件，选择 Chrome/Firefox: Launch 环境。然后将生成的 launch.json 的内容替换成为相应的配置：

*其中 `projectName` 的值需要替换为 `相应业务模块项目文件夹名称(例：web-xxx)`*

![avatar](./images/debug-config-add.png)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "projectName": "web-xxx",
      "url": "http://localhost:7001/${projectName}/",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    }
  ]
}

```

### 设置一个断点

1. 在代码中设置断点，譬如下图在 `line90` 的地方设置了一个断点，这里的 `data` 函数返回了一个字符串。

![avatar](./images/debug-breakpoint-set.png)

2. 在业务模块项目所在目录打开 VS Code 的集成终端并执行 `yarn dev` 或 `yarn dev:mock` 脚本开启这个应用。

```bash
yarn dev
```

3. 来到 Debug 视图，点击那个绿色的 play 按钮。

4. 随着一个新的浏览器实例打开  `http://localhost:7001/web-xxx`，你的断点现在应该被命中了。