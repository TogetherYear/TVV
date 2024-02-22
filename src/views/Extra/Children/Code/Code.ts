import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, ref } from "vue"
import * as Q from 'qrcode'

class Code extends AActor {
    public constructor() {
        super()
    }

    private canvas = ref<HTMLCanvasElement | null>(null)

    public InitStates() {
        return {
            canvas: this.canvas,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(async () => {
            await Renderer.Widget.SetShadow(true)
            this.CreateCode()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private async CreateCode() {
        if (this.canvas.value) {
            const text = await Renderer.Clipboard.ReadText() || 'https://github.com/TogetherYear'
            await Q.toCanvas(this.canvas.value, text, {
                width: 200,
                margin: 2,
            })
        }

    }
}

export { Code }