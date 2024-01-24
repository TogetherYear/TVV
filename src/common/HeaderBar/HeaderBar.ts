import { ref, onMounted, onUnmounted } from 'vue'
import { AActor } from '@/libs/AActor'

class HeaderBar extends AActor {
    public constructor() {
        super()
    }

    private isMax = ref<boolean>(false)

    public async OnOptionClick(type: string, main: boolean) {
        if (type == 'Min') {
            await Renderer.Widget.Min()
        }
        else if (type == 'Max') {
            this.isMax.value = !this.isMax.value
            await Renderer.Widget.Max()
        }
        else if (type == 'Close') {
            if (main) {
                await Renderer.Widget.Hide()
            }
            else {
                await Renderer.Widget.Close()
            }

        }
    }

    public InitStates() {
        return {
            isMax: this.isMax,
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
