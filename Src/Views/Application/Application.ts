import { onMounted, onUnmounted } from 'vue';
import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';
import { TTool } from '@/Decorators/TTool';
import { TEvent } from '@/Decorators/TEvent';

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
        Renderer.App.UpdateAutostartFlag(await Renderer.App.IsAutostart());
        await Renderer.Widget.SetSize(parseInt(localStorage.getItem(`Application:${this.Route}:Width`) || '1000'), parseInt(localStorage.getItem(`Application:${this.Route}:Height`) || '560'));
        await Renderer.Widget.SetShadow(true);
        await Renderer.Widget.Center();
        await Renderer.Widget.Show();
    }

    @TTool.Debounce(300)
    @TEvent.Listen(window, 'resize')
    private async OnResized(e: UIEvent) {
        localStorage.setItem(`Application:${this.Route}:Width`, `${window.innerWidth}`);
        localStorage.setItem(`Application:${this.Route}:Height`, `${window.innerHeight}`);
    }

    @TEvent.Listen(Renderer, Renderer.RendererEvent.SecondInstance)
    private async OnSecondInstance() {
        await Renderer.Widget.Show();
    }

    @TEvent.Listen(Renderer, Renderer.RendererEvent.CloseRequested)
    private async OnCloseRequested(e: Event) {
        await Renderer.Widget.Hide();
        e.preventDefault();
    }
}

export { Application };
