namespace Together {
    export function ES<T extends { new(...args: any[]): Object }>(C: T) {
        return class extends C {
            constructor(...args: any[]) {
                super(...args)
            }
            // ... Just do it ...
        }
    }
}
export { Together }
