import { EventSystem } from './EventSystem';

abstract class AActor extends EventSystem {
    constructor() {
        super();
    }

    public abstract InitStates(): Record<string, unknown>;

    public abstract InitHooks(): void;

    public abstract Run(): void;

    protected abstract Destroy(): void;
}

export { AActor };
