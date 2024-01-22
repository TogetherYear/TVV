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
        export function Invoke(cmd: string, args?: IT.InvokeArgs): Promise<unknown>

        /**
         * 获取所有窗口
         */
        export function GetAllWidgets(): Array<unknown>

        /**
         * 根据 label 获取窗口
         */
        export function GetWidgetByLabel(label: string): unknown

        /**
         * 创建新窗口 返回值是窗口类 自己翻阅文档 这里不在写类型说明
         */
        export function CreateWidget(label: IT.WindowLabel, options?: IT.IWindowOptions): unknown
    }

    /**
     * 系统弹窗
     */
    export namespace Dialog {
        /**
         * 消息框
         */
        export function Message(message: string, options?: IT.IMessageDialogOptions): Promise<boolean>

        /**
         * 询问框
         */
        export function Ask(message: string, options?: IT.IConfirmDialogOptions): Promise<boolean>

        /**
         * 确认框
         */
        export function Confirm(message: string, options?: IT.IConfirmDialogOptions): Promise<boolean>
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
        export function SetPosition(x: number, y: number): Promise<void>

        /**
         * 监听Tauri事件 不建议你们用这个 去用我的 AddListen
         */
        export function Listen<T>(event: string, handler: IT.EventCallback<T>): Promise<IT.UnlistenFn>
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
         * 获取路径的元数据 不能用Tauri转换后的地址
         */
        export function GetPathMetadata(path: string): Promise<Record<string, unknown>>

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
        export function WriteBinaryToFile(path: string, content: IT.BinaryFileContents): Promise<void>

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

        /**
         * 创建文件夹 不能用Tauri转换后的地址
         */
        export function CreateDir(path: string): Promise<void>

        /**
         * 删除文件夹 不能用Tauri转换后的地址
         */
        export function RemoveDir(path: string): Promise<void>

        /**
         * 删除文件 不能用Tauri转换后的地址
         */
        export function RemoveFile(path: string): Promise<void>

        /**
         * 重命名 不能用Tauri转换后的地址
         */
        export function Rename(path: string, newPath: string): Promise<void>

        /**
         * 复制文件 不能用Tauri转换后的地址
         */
        export function CopyFile(path: string, newPath: string): Promise<void>

        /**
         * 上传文件 不能用Tauri转换后的地址
         */
        export function Upload(url: string, path: string, progressHandler?: IT.ProgressHandler, headers?: Map<string, string>): Promise<void>

        /**
         * 下载文件 不能用Tauri转换后的地址
         */
        export function Download(url: string, path: string, progressHandler?: IT.ProgressHandler, headers?: Map<string, string>): Promise<void>
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
        export function Register(shortcut: string, handler: IT.ShortcutHandler): Promise<void>

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
        export function GetAllScreens(): Promise<Array<IT.Monitor>>

        /**
         * 获取当前窗口所在的屏幕
         */
        export function GetWidgetScreen(): Promise<IT.Monitor | null>

        /**
         * 获取系统主屏幕
         */
        export function GetPrimaryScreen(): Promise<IT.Monitor | null>
    }

    /**
     * 持久化本地数据仓库
     */
    export namespace Store {
        /**
         * 创建持久化本地仓库或加载已存在的
         */
        export function Create(name: string): Promise<{
            instance: unknown;
            Set: (key: string, value: unknown) => Promise<void>,
            Get: (key: string) => Promise<unknown>,
            Has: (key: string) => Promise<boolean>,
            Delete: (key: string) => Promise<boolean>,
            Keys: () => Promise<Array<string>>,
            Values: () => Promise<Array<unknown>>,
            Entries: () => Promise<Array<[string, unknown]>>,
            Length: () => Promise<number>,
            Clear: () => Promise<void>,
            Save: () => Promise<void>,
        }>
    }

    /**
     * 自动化
     */
    export namespace Autopilot {
        /**
         * 获取鼠标位置
         */
        export function GetMousePosition(): Promise<IT.Point>

        /**
         * 设置鼠标位置
         */
        export function SetMousePosition(x: number, y: number): Promise<void>

        /**
         * 点击鼠标 ( 以毫秒计 默认 100 毫秒 )
         */
        export function SetButtonClick(button: Button, delay?: number): Promise<void>

        /**
         * 设置鼠标状态
         */
        export function SetButtonToggle(button: Button, down: boolean): Promise<void>

        /**
         * 滑动滚轮
         */
        export function SetMouseScroll(direction: ScrollDirection, clicks: number): Promise<void>

        /**
         * 获取坐标位置的颜色 仅限主屏幕内坐标
         */
        export function GetColorFromPosition(x: number, y: number): Promise<IT.Color>

        /**
         * 获取当前鼠标位置的颜色 仅限主屏幕内坐标
         */
        export function GetCurrentPositionColor(): Promise<IT.Color>
    }

    export enum Button {
        Left = 0,
        Middle = 1,
        Right = 2,
    }

    export enum ScrollDirection {
        Down = 0,
        Up = 1,
    }

    export enum TauriEvent {
        Tauri = 'tauri://tauri',
        WidgetBlur = 'tauri://blur',
        WidgetCreate = 'tauri://window-created',
        WidgetDestroy = 'tauri://destroyed',
    }

    export enum RendererEvent {
        Message = 'Message',
        SecondInstance = 'SecondInstance',
        WidgetCreate = 'WidgetCreate',
        WidgetDestroy = 'WidgetDestroy'
    }

    /**
     * 监听事件
     */
    export function AddListen(key: RendererEvent, scope: Object, callback: IT.RendererEventCallback, once?: boolean): void

    /**
     * 取消监听事件
     */
    export function RemoveListen(key: RendererEvent, scope: Object, callback: IT.RendererEventCallback): void
}

declare namespace IT {
    export interface IWindowOptions {
        url?: string,
        center?: boolean,
        x?: number,
        y?: number,
        width?: number,
        height?: number,
        minWidth?: number,
        minHeight?: number,
        maxWidth?: number,
        maxHeight?: number,
        resizable?: boolean,
        title?: string,
        fullscreen?: boolean,
        focus?: boolean,
        transparent?: boolean,
        maximized?: boolean,
        visible?: boolean,
        decorations?: boolean,
        alwaysOnTop?: boolean,
        contentProtected?: boolean,
        skipTaskbar?: boolean,
        fileDropEnabled?: boolean,
        tabbingIdentifier?: string,
        userAgent?: string,
        maximizable?: boolean,
        minimizable?: boolean,
        closable?: boolean
    }

    export type WindowLabel = string;

    export interface IRendererSendMessage {
        event: Renderer.RendererEvent,
        send: string,
        extra?: Record<string, unknown>,
        [key: string]: unknown
    }

    export type RendererEventCallback = (e: IRendererSendMessage) => void

    export type BinaryFileContents = Iterable<number> | ArrayLike<number> | ArrayBuffer;

    /**
     * 调用此函数可以取消事件的监听
     */
    export type UnlistenFn = () => void;

    export interface IMessageDialogOptions {
        title?: string,
        type?: 'info' | 'warning' | 'error',
        okLabel?: string
    }

    export interface IConfirmDialogOptions {
        title?: string,
        type?: 'info' | 'warning' | 'error',
        okLabel?: string,
        cancelLabel?: string
    }

    export type InvokeArgs = Record<string, unknown>;

    export interface IEvent<T> {
        /**
         * 自己仔细看文档 事件是如何触发的
         */
        event: Renderer.TauriEvent;
        windowLabel: string;
        id: number;
        payload: T;
    }

    export type EventCallback<T> = (event: IEvent<T>) => void;

    export type ProgressHandler = (progress: number, total: number) => void;

    export type ShortcutHandler = (shortcut: string) => void;

    export type Color = {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    export type Point = {
        x: number,
        y: number
    }

    export type Monitor = {
        name: string | null;
        size: { width: number, height: number };
        position: { x: number, y: number };
        scaleFactor: number;
    }
}
