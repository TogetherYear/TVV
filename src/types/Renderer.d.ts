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
         * 通过名称获取文件路径 ( 仅限 Need 文件夹 ) 例如: Images/icon.png
         */
        export function GetPathByName(name: string): Promise<string>
    }
}