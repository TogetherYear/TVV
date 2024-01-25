import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, ref } from "vue"

class ModelPreview extends AActor {
    public constructor() {
        super()
    }

    private view = ref<HTMLSpanElement | null>(null)

    private modelUrl = ''

    public InitStates() {
        return {
            view: this.view,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(async () => {
            await this.CreatePreview()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private async CreatePreview() {
        this.modelUrl = await Renderer.Clipboard.ReadText() || ''
        Debug.Log(this.modelUrl)
    }
}

export { ModelPreview }