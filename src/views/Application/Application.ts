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
            // await Renderer.Extra.Code("https://www.zhihu.com/")
            // await Renderer.App.Invoke("InvokeTest", { x: 100, y: 100 })
        }, 3000);
    }
}

export { Application }