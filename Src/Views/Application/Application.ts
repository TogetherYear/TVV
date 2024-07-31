import { onMounted, onUnmounted } from 'vue';
import { AActor } from '@/Libs/AActor';
import { ElMessage } from 'element-plus';

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
            this.ListenEvents();
            await Renderer.Widget.SetShadow(true);
            await Renderer.Widget.Show();
        });
        onUnmounted(async () => {
            await Renderer.GlobalShortcut.UnregisterAll();
            this.Destroy();
        });
    }

    protected Destroy() {}

    private ListenEvents() {
        Renderer.AddListen(Renderer.RendererEvent.SecondInstance, this, this.OnSecondInstance);
    }

    private async OnSecondInstance(e: IT.IRendererSendMessage) {
        await Renderer.Widget.Show();
    }
}

export { Application };
