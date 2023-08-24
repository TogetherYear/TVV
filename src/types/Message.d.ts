declare namespace Message {
    export function info(content: string, ...args: any): void
    export function success(content: string, ...args: any): void
    export function warning(content: string, ...args: any): void
    export function error(content: string, ...args: any): void
    export function loading(content: string, ...args: any): void
    export function destroyAll(): void

}