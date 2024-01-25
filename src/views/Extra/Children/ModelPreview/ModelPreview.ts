import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, ref } from "vue"

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
            Debug.Log(Ammo)
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
}

export { ModelPreview }