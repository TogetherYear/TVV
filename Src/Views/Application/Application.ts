import { onMounted, onUnmounted } from 'vue';
import { Component } from '@/Libs/Component';
import { TRouter } from '@/Decorators/TRouter';
import { Renderer } from '@/Plugins/Renderer';

@TRouter.View({
    module: TRouter.Module.Default,
    duty: TRouter.Duty.Application
})
class Application extends Component {
    public constructor() {
        super();
    }

    public InitStates() {
        return {};
    }

    public Run() {
        onMounted(async () => {
            Renderer.App.UpdateAutostartFlag(await Renderer.App.IsAutostart());
            await Renderer.Widget.SetShadow(true);
            await Renderer.Widget.Focus();
        });

        onUnmounted(async () => {
            await Renderer.GlobalShortcut.UnregisterAll();
            this.Destroy();
        });
    }

    protected Destroy() {}
}

export { Application };
