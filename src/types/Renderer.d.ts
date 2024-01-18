declare namespace Renderer {
    /**
     * 窗口构造接口
     */
    export interface IWidget {
        url?: string;
        center?: boolean;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number;
        maxHeight?: number;
        resizable?: boolean;
        title?: string;
        fullscreen?: boolean;
        focus?: boolean;
        transparent?: boolean;
        maximized?: boolean;
        visible?: boolean;
        decorations?: boolean;
        alwaysOnTop?: boolean;
        contentProtected?: boolean;
        skipTaskbar?: boolean;
        fileDropEnabled?: boolean;
        tabbingIdentifier?: string;
        userAgent?: string;
        maximizable?: boolean;
        minimizable?: boolean;
        closable?: boolean;
    }

    /**
     * 应用
     */
    export namespace App {
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
        export function CreateWidget(label: string, options?: IWidget): unknown
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
         * 显示
         */
        export function Show(): Promise<void>

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
}