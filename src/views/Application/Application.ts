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
        })
        onUnmounted(async () => {
            await Renderer.GlobalShortcut.UnregisterAll()
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    public async Test() {
        // const struct = await Renderer.App.Invoke("GetRustStruct") as Record<string, unknown>
        // Message.success(Object.entries(struct).map(c => c.join(':')).join(';'))
        if (await Renderer.App.IsAutostart()) {
            await Renderer.App.SetAutostart(false)
        }
        else {
            await Renderer.App.SetAutostart(true)
        }
    }
}

export { Application }