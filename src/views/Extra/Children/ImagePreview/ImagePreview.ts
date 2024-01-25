import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, ref } from "vue"
import * as L from 'leafer-ui'
import { Mathf } from "@/libs/Mathf"

class ImagePreview extends AActor {
    public constructor() {
        super()
    }

    private view = ref<HTMLSpanElement | null>(null)

    public l!: L.Leafer

    private preview = {
        url: '',
        width: 0,
        height: 0
    }

    private image!: L.Image

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
        const split = (await Renderer.Clipboard.ReadText() || '').split('$')
        if (split.length == 3) {
            this.preview.url = split[0]
            this.preview.width = parseInt(split[1])
            this.preview.height = parseInt(split[2])
            this.CreateLeafer()
        }

    }

    private CreateLeafer() {
        if (this.view.value) {
            this.l = new L.Leafer({
                view: this.view.value,
                wheel: { zoomMode: true, preventDefault: true },
                webgl: true,
                type: 'design',
            })
            this.image = new L.Image({
                url: this.preview.url,
                zIndex: 0,
                around: 'center',
                x: this.l.width / 2,
                y: this.l.height / 2,
                scale: Mathf.Clamp(0.1, 99, (this.l.width - 200) / this.preview.width)
            })
            this.l.add(this.image)
        }
    }
}

export { ImagePreview }