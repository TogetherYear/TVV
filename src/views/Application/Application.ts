import { onMounted, onUnmounted } from "vue"
import { AActor } from "@/libs/AActor"
import { appWindow } from "@tauri-apps/api/window"

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
        })
        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    public async Test() {
        const a = await Renderer.App.Invoke("Introduce") as string
        Message.success(a)
    }
}

export { Application }