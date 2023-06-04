declare namespace Dialog {
    export function destroyAll(): void
    export function create(...args: any): void
    export function success(...args: any): void
    export function warning(...args: any): void
    export function error(...args: any): void
    export function info(...args: any): void
}