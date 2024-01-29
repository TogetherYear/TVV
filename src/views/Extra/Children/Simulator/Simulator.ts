import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, ref } from "vue"
import * as L from 'leafer-ui'

class Simulator extends AActor {
    public constructor() {
        super()
    }

    private view = ref<HTMLSpanElement | null>(null)

    public l!: L.Leafer

    public InitStates() {
        return {
            view: this.view,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(() => {
            this.CreateLeafer()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private CreateLeafer() {
        if (this.view.value) {
            this.l = new L.Leafer({
                view: this.view.value,
                wheel: { zoomMode: true, preventDefault: true },
                webgl: true,
                type: 'design',
            })
        }
    }
}

export { Simulator }