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

    public async TestA() {

    }

    public async TestB() {

    }

    public async TestC() {

    }
}

export { Application }