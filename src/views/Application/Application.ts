import { onMounted, onUnmounted } from "vue"
import { AActor } from "@/libs/AActor"
import { invoke } from '@tauri-apps/api'
import { appWindow } from "@tauri-apps/api/window"

class Application extends AActor {
    public constructor() { super() }

    public InitStates() {
        return {}
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(async () => {
            await appWindow.show()
            await appWindow.setFocus()
        })
        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    public Test() {
        invoke("Introduce").then(res => {
            Message.success(res as string)
        })
    }
}

export { Application }