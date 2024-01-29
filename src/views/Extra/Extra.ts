import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted } from "vue"

class Extra extends AActor {
    public constructor() {
        super()
    }

    public InitStates() {
        return {

        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(async () => {
            await Renderer.Widget.SetWindowShadow(true)
            await Renderer.Widget.Show()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }
}

export { Extra }