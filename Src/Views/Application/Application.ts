import { onMounted, onUnmounted } from 'vue';
import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';
import { TEvent } from '@/Decorators/TEvent';
import { TWindow } from '@/Decorators/TWindow';
import { TTest } from '@/Decorators/TTest';

@TWindow.State()
class Application extends Component {
    public constructor() {
        super();
    }

    public InitStates() {
        return {};
    }

    public Run() {
        onMounted(async () => {
            await this.SetDefault();
        });

        onUnmounted(async () => {
            await Renderer.GlobalShortcut.UnregisterAll();
            this.Destroy();
        });
    }

    protected Destroy() {}

    private async SetDefault() {
        await Renderer.Widget.SetShadow(false);
        await Renderer.Widget.Center();
        await Renderer.Widget.Show();
    }

    @TEvent.Listen(Renderer, Renderer.RendererEvent.SecondInstance)
    private async OnSecondInstance() {
        await Renderer.Widget.Show();
    }

    @TEvent.Listen(Renderer, Renderer.RendererEvent.CloseRequested)
    private async OnCloseRequested(e: Event) {
        e.preventDefault();
        await Renderer.Widget.Hide();
    }

    @TTest.BindFunction('Test')
    private async Test() {
        console.log(await Renderer.Tray.StopFlash());
    }
}

export { Application };
