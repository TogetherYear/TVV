import { ref, onMounted, onUnmounted } from 'vue'
import minIcon from '@/assets/mc/min.png'
import maxIcon from '@/assets/mc/max.png'
import closeIcon from '@/assets/mc/close.png'
import { AActor } from '@/libs/AActor'
import { DR } from '@/decorators/DR'

class HeaderBar extends AActor {
    public constructor() {
        super()
    }

    private options = ref<Array<DR.IHeaderBarOptionItem>>([
        { type: 'Min', icon: minIcon, label: '最小化' },
        { type: 'Max', icon: maxIcon, label: '最大化' },
        { type: 'Hide', icon: closeIcon, label: '隐藏' }
    ])

    private isMax = ref<boolean>(false)

    public async OptionClick(type: string) {
        if (type == 'Min') {
            await Renderer.Widget.Min()
        }
        else if (type == 'Max') {
            this.isMax.value = !this.isMax.value
            await Renderer.Widget.Max()
        }
        else if (type == 'Hide') {
            await Renderer.Widget.Hide()
        }
    }

    public InitStates() {
        return {
            isMax: this.isMax,
            options: this.options,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(() => {

        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }
}

export { HeaderBar }
