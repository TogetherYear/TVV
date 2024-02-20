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
            await Renderer.Widget.SetShadow(true)
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
            // Debug.Log(await Renderer.Window.GetAllWindows())
            const icon = await Renderer.Resource.GetPathByName("Images/new.ico", false)
            Renderer.Tray.Flash(icon)

            setTimeout(() => {
                Renderer.Tray.StopFlash(icon)
            }, 20000);
        }, 3000);
    }
}

export { Application }