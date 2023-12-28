import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted } from "vue"
import { process } from '@tauri-apps/api'
import { appWindow } from "@tauri-apps/api/window";

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
        appWindow.listen("tauri://blur", async () => {
            await appWindow.hide()
        })
    }

    public async OnClose() {
        await process.exit(0)
    }
}

export { Tray }