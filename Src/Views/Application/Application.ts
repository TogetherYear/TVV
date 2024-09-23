import { onMounted, onUnmounted } from 'vue';
import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';
import { TTest } from '@/Decorators/TTest';
import { tauri } from '@tauri-apps/api';

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
