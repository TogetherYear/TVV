import { TEvent } from '@/Decorators/TEvent';
import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';
import { onMounted, onUnmounted, ref } from 'vue';
import openIcon from '@/Assets/MC/open.png';
import { I } from '@/Instructions/I';
import { Time } from '@/Utils/Time';

class Tray extends Component {
    public constructor() {
        super();
    }

    private menu = ref<Array<I.MenuItem>>([
        {
            icon: openIcon,
            key: '开机自启',
            check: false,
            id: Time.GenerateRandomUid()
        },
        {
            icon: '',
            key: 'Separator',
            check: false,
            id: Time.GenerateRandomUid()
        },
        {
            icon: '',
            key: '退出',
            check: false,
            id: Time.GenerateRandomUid()
        }
    ]);

    public InitStates() {
        return {
            menu: this.menu
        };
    }

    public InitHooks() {}

    public Run() {
        onMounted(async () => {
            await this.SetDefault();
            this.SetAutostart();
        });

        onUnmounted(() => {
            this.Destroy();
        });
    }

    protected Destroy() {}

    private async SetDefault() {
        await Renderer.Widget.SetSize(126, 68);
    }

    private async SetAutostart() {
        const at = this.menu.value.find((m) => m.key === '开机自启');
        if (at) {
            at.check = await Renderer.App.IsAutostart();
        }
    }

    public async OnMenuClick(m: I.MenuItem) {
        if (m.key === '开机自启') {
            const at = await Renderer.App.IsAutostart();
            await Renderer.App.SetAutostart(!at);
            await this.SetAutostart();
        } else if (m.key === '退出') {
            await Renderer.App.Close();
        }
    }

    @TEvent.Listen(Renderer, Renderer.RendererEvent.PopupTray)
    private async OnPopupTray(payload: Record<string, unknown>) {
        const position = payload.extra as { x: number; y: number };
        const size = await Renderer.Widget.GetSize();
        await Renderer.Widget.SetPosition(position.x - size.width, position.y - size.height);
        await Renderer.Widget.Show();
    }

    @TEvent.Listen(Renderer, Renderer.RendererEvent.Blur)
    private async OnBlur() {
        await Renderer.Widget.Hide();
    }
}

export { Tray };
