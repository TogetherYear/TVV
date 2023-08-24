import { onMounted, onUnmounted } from "vue"
import { AActor } from "@/libs/AActor"
import { invoke } from '@tauri-apps/api'

class Vessel extends AActor {
    public constructor() { super() }

    public InitStates() {
        return {}
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(() => {

        })
        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    public Test() {
        invoke("renderer", { name: 'Hello World !' }).then(res => {
            Message.success(res as string)
        })
    }
}

export { Vessel }