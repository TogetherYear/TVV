## Vue 3 + Typescript + Tauri + Vite + ( ...args )

### 基本模板

```
默认打包后本地服务器端口是 34290 可修改 避免重复
```

```
只适配 windows 其他暂不考虑
```

```
已知问题：如果想要用 SharedArrayBuffer
就需要加上 "additionalBrowserArgs": "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection --enable-features=SharedArrayBuffer"
但这会导致在运行时创建额外的窗口失败
```
