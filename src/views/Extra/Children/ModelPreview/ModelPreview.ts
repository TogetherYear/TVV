import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, ref } from "vue"
import { GameLoop } from "./Core/Manager/Gameloop"
import { WebGLWorld } from "./Core/Manager/WebGLWorld"
import { EntityPool } from "./Core/Manager/EntityPool"
import { Generate } from "./Core/Manager/Generate"
import { InputSystem } from "./Core/Manager/InputSystem"
import { Physics } from "./Core/Manager/Physics"
import { Time } from "./Core/Manager/Time"

class ModelPreview extends AActor {
    public constructor() {
        super()
    }

    private view = ref<HTMLSpanElement | null>(null)

    private modelUrl = ''

    public InitStates() {
        return {
            view: this.view,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(async () => {
            await this.CreatePreview()
            await this.LoadPlugins()
            await this.Generate()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private async CreatePreview() {
        this.modelUrl = await Renderer.Clipboard.ReadText() || ''
    }

    private LoadPlugins() {
        return new Promise(async (resolve, reject) => {
            let script = document.createElement("script");
            script.src = await Renderer.Resource.GetPathByName(`Plugins/Ammo/ammo.wasm.js`);
            document.body.appendChild(script);
            script.onload = (e) => {
                resolve("Ammo")
            }
        })

    }

    private async Generate() {
        GameLoop.Instance.InitEvents()
        WebGLWorld.Instance.Run()
        Time.Instance.Run()
        InputSystem.Instance.Run()
        await Physics.Instance.Run()
        Generate.Instance.Run()
        EntityPool.Instance.Run()
        GameLoop.Instance.Run()
    }
}

export { ModelPreview }