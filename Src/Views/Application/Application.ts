import { onMounted, onUnmounted } from 'vue';
import { AActor } from '@/Libs/AActor';

class Application extends AActor {
    public constructor() {
        super();
    }

    public InitStates() {
        return {};
    }

    public InitHooks() {}

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
