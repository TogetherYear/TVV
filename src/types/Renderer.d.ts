declare namespace Renderer {
    /**
     * 应用
     */
    export namespace App {
        /**
         * 关闭
         */
        export function Close(): Promise<void>

        /**
         * 调用Rust方法
         */
        export function Invoke(cmd: string, args?: Record<string, unknown>): Promise<unknown>
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
         * 通过名称获取文件路径 ( 仅限 Need 文件夹 ) 例如: Images/icon.png ( convert 是否转换 默认 true)
         */
        export function GetPathByName(name: string, convert?: boolean): Promise<string>
        /**
         * 读取Json文件到对象 不能用Tauri转换后的地址
         */
        export function ReadJsonFileToObject(path: string): Promise<Record<string, unknown>>
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
    }
}