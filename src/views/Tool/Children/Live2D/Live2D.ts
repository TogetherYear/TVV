import { onMounted, onUnmounted, ref } from "vue"
import * as L from 'live2d-render'
import { useRoute } from "vue-router"

class Live2D {
    public constructor() {

    }

    public InitStates() {
        return {

        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(async () => {
            await this.CreateModel()
            await this.SetPosition()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private async CreateModel() {
        const route = useRoute()
        await L.initializeLive2D({
            BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],
            ResourcesPath: Renderer.Resource.GetFileByNameFromLocalServer(`Libs/Models/${route.query.modelJson}`),
            CanvasSize: 'auto',
            CanvasId: 'Live2D',
            MinifiedJSUrl: await Renderer.Resource.GetPathByName("Libs/Live2D/minified.js"),
            Live2dCubismcoreUrl: await Renderer.Resource.GetPathByName("Libs/Live2D/live2dcubismcore.min.js"),
        })
        const model = document.querySelector('#Live2D') as HTMLCanvasElement
        model.setAttribute('data-tauri-drag-region', 'true')
    }

    private async SetPosition() {
        const size = await Renderer.Widget.GetSize()
        const primaryMonitor = await Renderer.Monitor.GetPrimaryMonitor()
        await Renderer.Widget.SetPosition(primaryMonitor.x + (primaryMonitor.width - size.width - 10), primaryMonitor.y + (primaryMonitor.height - size.height - 10))
        await Renderer.Widget.Show()
    }
}

export { Live2D }