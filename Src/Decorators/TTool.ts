namespace TTool {
    const debounceMap = new Map<string, NodeJS.Timeout>();

    const throttleMap = new Map<string, number>();

    /**
     * 防抖 默认 500 毫秒
     */
    export function Debounce(delta = 500) {
        return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
            const original = descriptor.value.bind(target);
            descriptor.value = (...args: Array<unknown>) => {
                const key = `${target.constructor.name}:${propertyKey}`;
                let timer = debounceMap.get(key);
                if (timer) {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        original(...args);
                        debounceMap.delete(key);
                    }, delta);
                } else {
                    timer = setTimeout(() => {
                        original(...args);
                        debounceMap.delete(key);
                    }, delta);
                }
                debounceMap.set(key, timer);
            };
        };
    }

    /**
     * 节流 默认 500 毫秒
     */
    export function Throttle(delta = 500) {
        return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
            const original = descriptor.value.bind(target);
            descriptor.value = (...args: Array<unknown>) => {
                const key = `${target.constructor.name}:${propertyKey}`;
                let lastTime = throttleMap.get(key);
                if (lastTime) {
                    const currentTime = Date.now();
                    if (currentTime - lastTime > delta) {
                        lastTime = currentTime;
                        original(...args);
                    }
                } else {
                    lastTime = Date.now();
                    original(...args);
                }
                throttleMap.set(key, lastTime);
            };
        };
    }
}
export { TTool };
