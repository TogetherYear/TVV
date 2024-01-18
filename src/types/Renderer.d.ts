declare namespace Renderer {
    /**
     * 应用
     */
    export namespace App {
        /**
         * 是否开机自启
         */
        export function IsAutostart(): Promise<boolean>

        /**
         * 设置开机自启
         */
        export function SetAutostart(b: boolean): Promise<void>

        /**
         * 关闭
         */
        export function Close(): Promise<void>

        /**
         * 重启
         */
        export function Relaunch(): Promise<void>

        /**
         * 调用Rust方法
         */
        export function Invoke(cmd: string, args?: Record<string, unknown>): Promise<unknown>

        /**
         * 创建新窗口
         */
        export function CreateWidget(label: string, options?: Record<string, unknown>): unknown
    }

    /**
     * 系统弹窗
     */
    export namespace Dialog {
        /**
         * 消息框
         */
        export function Message(message: string, options?: string | { title?: string, type?: 'info' | 'warning' | 'error', okLabel?: string }): Promise<boolean>

        /**
         * 询问框
         */
        export function Ask(message: string, options?: string | { title?: string, type?: 'info' | 'warning' | 'error', okLabel?: string, cancelLabel?: string }): Promise<boolean>

        /**
         * 确认框
         */
        export function Confirm(message: string, options?: string | { title?: string, type?: 'info' | 'warning' | 'error', okLabel?: string, cancelLabel?: string }): Promise<boolean>
    }

    /**
     * 剪切板
     */
    export namespace Clipboard {
        /**
         * 写入剪切板
         */
        export function WriteText(text: string): Promise<void>

        /**
         * 读取剪切板
         */
        export function ReadText(): Promise<string | null>
    }

    /**
     * 窗口
     */
    export namespace Widget {
        /**
         * 最小化
         */
        export function Min(): Promise<void>

        /**
         * 最大化或者恢复最大化之前状态
         */
        export function Max(): Promise<void>

        /**
         * 隐藏
         */
        export function Hide(): Promise<void>

        /**
         * 关闭
         */
        export function Close(): Promise<void>

        /**
         * 显示
         */
        export function Show(): Promise<void>

        /**
         * 居中
         */
        export function Center(): Promise<void>

        /**
         * 设置是否显示在最上层
         */
        export function SetAlwaysOnTop(b: boolean): Promise<void>

        /**
         * 设置大小
         */
        export function SetSize(width: number, height: number): Promise<void>

        /**
         * 设置位置
         */
        export function setPosition(x: number, y: number): Promise<void>

        /**
         * 监听Tauri事件
         */
        export function Listen<T>(event: string, handler: (event: { event: string, windowLabel: string, id: number, payload: T }) => void): Promise<() => void>
    }

    /**
     * 资源
     */
    export namespace Resource {
        /**
         * 通过名称获取文件路径 ( 仅限 Need 文件夹 ) 例如: Images/icon.png ( convert 是否转换成 Webview 可使用的格式 默认 true)
         */
        export function GetPathByName(name: string, convert?: boolean): Promise<string>

        /**
         * 从读取文件转换为字符串 不能用Tauri转换后的地址
         */
        export function ReadStringFromFile(path: string): Promise<string>

        /**
         * 将字符串写入文件 不能用Tauri转换后的地址
         */
        export function WriteStringToFile(path: string, content: string): Promise<void>

        /**
         * 从读取文件转换为字节数组 不能用Tauri转换后的地址
         */
        export function ReadBinaryFromFile(path: string): Promise<Uint8Array>

        /**
         * 将字节数组写入文件 不能用Tauri转换后的地址
         */
        export function WriteBinaryToFile(path: string, content: Iterable<number> | ArrayLike<number> | ArrayBuffer): Promise<void>

        /**
         * 在文件资源管理器中打开路径 不能用Tauri转换后的地址
         */
        export function OpenPathInFolder(path: string): Promise<void>

        /**
         * 判断文件是否存在 不能用Tauri转换后的地址
         */
        export function IsPathExists(path: string): Promise<boolean>

        /**
         * 获取文件夹里所有文件列表 不能用Tauri转换后的地址
         */
        export function ReadDirFiles(path: string): Promise<Array<{ path: string, name?: string }>>
    }

    /**
     * 全局快捷键
     */
    export namespace GlobalShortcut {
        /**
         * 取消所有全局快捷键
         */
        export function UnregisterAll(): Promise<void>

        /**
         * 快捷键是否已注册
         */
        export function IsRegistered(shortcut: string): Promise<boolean>

        /**
         * 注册快捷键
         */
        export function Register(shortcut: string, handler: (shortcut: string) => {}): Promise<void>

        /**
         * 取消快捷键
         */
        export function Unregister(shortcut: string): Promise<void>
    }

    /**
     * 屏幕
     */
    export namespace Screen {
        /**
         * 获取所有屏幕
         */
        export function GetAllScreens(): Promise<Array<{ name: string | null, size: { width: number, height: number }, position: { x: number, y: number }, scaleFactor: number }>>

        /**
         * 获取当前窗口所在的屏幕
         */
        export function GetWidgetScreen(): Promise<{ name: string | null, size: { width: number, height: number }, position: { x: number, y: number }, scaleFactor: number } | null>
    }

    /**
     * 监听事件
     */
    export function AddListen(key: string, scope: Object, callback: (e: { event: string, send: string }) => void, once?: boolean): void

    /**
     * 取消监听事件
     */
    export function RemoveListen(key: string, scope: Object, callback: (e: { event: string, send: string }) => void): void
}