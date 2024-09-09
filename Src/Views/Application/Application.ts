import { onMounted, onUnmounted } from 'vue';
import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';

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
