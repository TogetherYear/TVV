import { AActor } from "@/libs/AActor"
import { appWindow } from "@tauri-apps/api/window"
import { onMounted, onUnmounted } from "vue"

class Tray extends AActor {
    public constructor() { super() }

    public InitStates() {
        return {}
    }

    public InitHooks() {

    }

    public Run() {
        this.ListenEvents()
        onMounted(() => {

        })
        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private ListenEvents() {
        Renderer.Widget.Listen("tauri://blur", async () => {
            await Renderer.Widget.Hide()
        })
    }

    public async OnClose() {
        await Renderer.App.Close()
    }
}

export { Tray }