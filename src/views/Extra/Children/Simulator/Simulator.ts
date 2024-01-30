import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, ref } from "vue"
import * as L from 'leafer-ui'
import { Entity } from "./Core/Behaviour/Entity"
import { Panel } from "./Components/Panel/Panel"
import { Main } from "./Core/Behaviour/Main"
import { Type } from "./Type"
import { MouseClick } from "./Core/Behaviour/MouseClick"
import { MouseMove } from "./Core/Behaviour/MouseMove"
import { MouseDown } from "./Core/Behaviour/MouseDown"
import { MouseUp } from "./Core/Behaviour/MouseUp"
import { KeyboardClick } from "./Core/Behaviour/KeyboardClick"
import { KeyboardToggle } from "./Core/Behaviour/KeyboardToggle"
import { WriteText } from "./Core/Behaviour/WriteText"

class Simulator extends AActor {
    public constructor() {
        super()
    }

    private view = ref<HTMLSpanElement | null>(null)

    public l!: L.Leafer

    public entities: Array<Entity> = []

    public panel = new Panel(this)

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

            new Main({
                simulator: this,
                x: 100,
                y: 100
            })
        }
    }

    public ToAddSelectAction(action: Type.ActionType, position: { x: number, y: number }) {
        let entity: Entity | null = null
        switch (action) {
            case Type.ActionType.MouseClick:
                entity = new MouseClick({
                    simulator: this,
                    button: Renderer.Button.Left,
                    x: position.x,
                    y: position.y,
                })
                break;
            case Type.ActionType.MouseMove:
                entity = new MouseMove({
                    simulator: this,
                    x: position.x,
                    y: position.y,
                    targetX: 10,
                    targetY: 10
                })
                break;
            case Type.ActionType.MouseDown:
                entity = new MouseDown({
                    simulator: this,
                    button: Renderer.Button.Left,
                    x: position.x,
                    y: position.y,
                })
                break;
            case Type.ActionType.MouseUp:
                entity = new MouseUp({
                    simulator: this,
                    button: Renderer.Button.Left,
                    x: position.x,
                    y: position.y,
                })
                break;
            case Type.ActionType.KeyboardClick:
                entity = new KeyboardClick({
                    simulator: this,
                    keys: [],
                    x: position.x,
                    y: position.y,
                })
                break;
            case Type.ActionType.KeyboardToggle:
                entity = new KeyboardToggle({
                    simulator: this,
                    keys: [],
                    x: position.x,
                    y: position.y,
                })
                break;
            case Type.ActionType.WriteText:
                entity = new WriteText({
                    simulator: this,
                    content: "TSingleton",
                    x: position.x,
                    y: position.y,
                })
                break;
            default: break;
        }
        if (entity) {
            this.ToLinkActions(entity)
        }
    }

    private ToLinkActions(entity: Entity) {
        const start = this.entities[this.entities.length - 2]
        start.Link(entity)
    }
}

export { Simulator }