import { onMounted, onUnmounted } from "vue"
import { AActor } from "@/libs/AActor"

class Application extends AActor {
    public constructor() { super() }

    public InitStates() {
        return {

        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(async () => {
            await Renderer.Widget.Show()
            this.Test()
        })
        onUnmounted(async () => {
            await Renderer.GlobalShortcut.UnregisterAll()
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private Test() {
        setTimeout(async () => {
            // const monitor = await Renderer.Monitor.GetCurrentMouseMonitor()
            // const url = await monitor.Capture()
            // await Renderer.Extra.ImagePreview(`${url}$${monitor.width}$${monitor.height}`)

            // await Renderer.Extra.ModelPreview()

            // await Renderer.App.Invoke("InvokeTest", { x: 100, y: 100 })
        }, 3000);
    }
}

export { Application }