import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, ref } from "vue"

class TablePreview extends AActor {
    public constructor() {
        super()
    }

    private petUrl = ''

    private view = ref<HTMLSpanElement | null>(null)

    public InitStates() {
        return {
            view: this.view,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(() => {
            this.CreatePreview()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private async CreatePreview() {
        this.petUrl = await Renderer.Clipboard.ReadText() || ''
        Debug.Log(this.petUrl)
    }
}

export { TablePreview }