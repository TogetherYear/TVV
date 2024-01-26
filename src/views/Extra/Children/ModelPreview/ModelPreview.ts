import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted } from "vue"
import { GameLoop } from "./Core/Manager/Gameloop"
import { WebGLWorld } from "./Core/Manager/WebGLWorld"
import { EntityPool } from "./Core/Manager/EntityPool"
import { Generate } from "./Core/Manager/Generate"
import { InputSystem } from "./Core/Manager/InputSystem"
import { Time } from "./Core/Manager/Time"

class ModelPreview extends AActor {
    public constructor() {
        super()
    }

    public InitStates() {
        return {

        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(() => {
            this.Generate()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private async Generate() {
        GameLoop.Instance.InitEvents()
        WebGLWorld.Instance.Run()
        Time.Instance.Run()
        InputSystem.Instance.Run()
        Generate.Instance.Run()
        EntityPool.Instance.Run()
        GameLoop.Instance.Run()
    }
}

export { ModelPreview }