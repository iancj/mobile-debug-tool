# mobile web console debug tool

移动设备上的web版console调试工具

重载了浏览器自带的console.log方法，方便在手机上实时查看调试信息。不依赖于任何类库，自动加载样式文件。

### Demo
<a href="http://iancj.github.io/mobile-debug-tool/" target="_blank">Click Here</a>

### 使用方法
项目中引入mob-debug.js，在需要调试的源码中使用`console.log()`或者`console.error()`，或者使用工具自带的输入框输入你的命令

启动工具：

```
<script>
MobDebug.start();
</script>
```

### TODO

> console.warn

> console.info

> tool's animations

> ~~ console.error~~

> ~~ 执行命令~~