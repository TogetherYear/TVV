import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, ref } from "vue"
import * as L from 'leafer-ui'
import { Entity } from "./Core/Behaviour/Entity"
import { MouseClick } from "./Core/Behaviour/MouseClick"
import { MouseMove } from "./Core/Behaviour/MouseMove"
import { MouseDown } from "./Core/Behaviour/MouseDown"
import { MouseUp } from "./Core/Behaviour/MouseUp"
import { WriteText } from "./Core/Behaviour/WriteText"

class Simulator extends AActor {
    public constructor() {
        super()
    }

    private view = ref<HTMLSpanElement | null>(null)

    public l!: L.Leafer

    public entities: Array<Entity> = []

    public InitStates() {
        return {
            view: this.view,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(() => {
            this.CreateLeafer()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private CreateLeafer() {
        if (this.view.value) {
            this.l = new L.Leafer({
                view: this.view.value,
                wheel: { zoomMode: true, preventDefault: true },
                webgl: true,
                type: 'design',
            })

            new MouseClick({
                simulator: this,
                button: Renderer.Button.Left,
                main: true
            })

            new MouseDown({
                simulator: this,
                button: Renderer.Button.Middle,
                main: true
            })

            new MouseUp({
                simulator: this,
                button: Renderer.Button.Right,
                main: true
            })

            new MouseMove({
                simulator: this,
                targetX: 1920,
                targetY: 1080
            })

            new WriteText({
                simulator: this,
                content: "AAA"
            })
        }
    }
}

export { Simulator }