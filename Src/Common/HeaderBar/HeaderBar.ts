import { onMounted, onUnmounted, ref } from 'vue';
import minIcon from '@/Assets/MC/min.png';
import maxIcon from '@/Assets/MC/max.png';
import hideIcon from '@/Assets/MC/hide.png';
import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';
import { I } from '@/Instructions/I';

class HeaderBar extends Component {
    public constructor() {
        super();
    }

    private options = ref<Array<I.IHeaderBarOptionItem>>([
        { type: 'Min', icon: minIcon, label: '最小化' },
        { type: 'Max', icon: maxIcon, label: '最大化' },
        { type: 'Hide', icon: hideIcon, label: '隐藏' }
    ]);

    public async OnOptionClick(btn: string) {
        if (btn === 'Min') {
            await Renderer.Widget.Min();
        } else if (btn === 'Max') {
            await Renderer.Widget.Max();
        } else if (btn === 'Hide') {
            await Renderer.Widget.Hide();
        }
    }

    public InitStates() {
        return {
            options: this.options
        };
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
