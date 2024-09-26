import { TComponent } from '@/Decorators/TComponent';
import { TEvent } from '@/Decorators/TEvent';
import { TRouter } from '@/Decorators/TRouter';
import { TTest } from '@/Decorators/TTest';
import { TTool } from '@/Decorators/TTool';
import { Entity } from './Entity';
import { TWindow } from '@/Decorators/TWindow';

/**
 * 页面组件
 */
@TWindow.Generate()
@TTest.Generate()
@TTool.Generate()
@TRouter.Generate()
@TEvent.Generate(TEvent.Lifecycle.Temporary)
@TComponent.Generate()
class Component<T extends Component<T> | null = null> extends Entity {
    public constructor(parent: T | null = null) {
        super();
        this.parent = parent;
    }

    public parent: T | null = null;

    public get P() {
        return this.parent!;
    }
}

export { Component };
