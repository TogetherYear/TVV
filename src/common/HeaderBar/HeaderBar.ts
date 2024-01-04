import { ref, onMounted, onUnmounted } from 'vue'
import minIcon from '@/assets/mc/min.png'
import maxIcon from '@/assets/mc/max.png'
import closeIcon from '@/assets/mc/close.png'
import { AActor } from '@/libs/AActor'
import { appWindow } from '@tauri-apps/api/window'
import { DR } from '@/decorators/DR'

class HeaderBar extends AActor {
    public constructor() {
        super()
    }

    private dragDomRegion = ref<HTMLSpanElement | null>(null)

    private fullscreen = ref<boolean>(false)

    private options = ref<Array<DR.IHeaderBarOptionItem>>([
        { type: 'Min', icon: minIcon, label: '最小化' },
        { type: 'Max', icon: maxIcon, label: '最大化' },
        { type: 'Hide', icon: closeIcon, label: '隐藏' }
    ])

    public async OptionClick(type: string) {
        if (type == 'Min') {
            await appWindow.minimize()
        }
        else if (type == 'Max') {
            if (await appWindow.isFullscreen()) {
                await appWindow.setFullscreen(false)
                await appWindow.setResizable(true)
                this.fullscreen.value = false
            }
            else {
                await appWindow.setFullscreen(true)
                await appWindow.setResizable(false)
                this.fullscreen.value = true
            }
        }
        else if (type == 'Hide') {
            await appWindow.hide()
        }
    }

    public InitStates() {
        return {
            options: this.options,
            dragDomRegion: this.dragDomRegion,
            fullscreen: this.fullscreen,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(() => {
            this.ListenEvents()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private ListenEvents() {
        if (this.dragDomRegion.value) {
            this.dragDomRegion.value.addEventListener('dblclick', async (e) => {
                e.stopPropagation()
                e.preventDefault()
                e.stopImmediatePropagation()
                await this.OptionClick("Max")
            })
        }
    }
}

export { HeaderBar }
