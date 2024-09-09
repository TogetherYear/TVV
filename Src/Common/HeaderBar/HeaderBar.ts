import { onMounted, onUnmounted } from 'vue';
import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';

class HeaderBar extends Component {
    public constructor() {
        super();
    }

    public async OnOptionClick(btn: string, type: string) {
        if (btn == 'Min') {
            await Renderer.Widget.Min();
        } else if (btn == 'Max') {
            await Renderer.Widget.Max();
        } else if (btn == 'Close') {
            if (type == 'main') {
                await Renderer.Widget.Hide();
            } else {
                await Renderer.Widget.Close();
            }
        }
    }

    public InitStates() {
        return {};
    }

    public Run() {
        onMounted(() => {});

        onUnmounted(() => {
            this.Destroy();
        });
    }

    protected Destroy() {}
}

export { HeaderBar };
