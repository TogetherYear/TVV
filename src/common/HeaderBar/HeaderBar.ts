import { ref, onMounted, onUnmounted } from 'vue'
import minIcon from '@/assets/mc/min.png'
import maxIcon from '@/assets/mc/max.png'
import closeIcon from '@/assets/mc/close.png'
import { AActor } from '@/libs/AActor'
import { appWindow } from '@tauri-apps/api/window'


interface IOptionItem {
    type: string,
    icon: string,
    label: string
}

class HeaderBar extends AActor {
    public constructor() {
        super()
    }

    private options = ref<Array<IOptionItem>>([
        { type: 'Min', icon: minIcon, label: '最小化' },
        { type: 'Max', icon: maxIcon, label: '最大化' },
        { type: 'Close', icon: closeIcon, label: '隐藏' }
    ])

    public async OptionClick(type: string) {
        if (type == 'Min') {
            await appWindow.minimize()
        }
        else if (type == 'Max') {
            if (await appWindow.isMaximized()) {
                appWindow.unmaximize()
            }
            else {
                await appWindow.maximize()
            }
        }
        else if (type == 'Close') {
            appWindow.close()
        }
    }

    public InitStates() {
        return {
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
