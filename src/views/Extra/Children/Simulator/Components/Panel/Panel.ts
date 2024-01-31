import { onMounted, onUnmounted, ref } from "vue"
import { Simulator } from "../../Simulator"
import { Type } from "../../Type"
import { Entity } from "../../Core/Behaviour/Entity"
import { MouseClick } from "../../Core/Behaviour/MouseClick"
import { MouseMove } from "../../Core/Behaviour/MouseMove"
import { KeyboardClick } from "../../Core/Behaviour/KeyboardClick"
import { KeyboardToggle } from "../../Core/Behaviour/KeyboardToggle"
import { MouseDown } from "../../Core/Behaviour/MouseDown"
import { MouseUp } from "../../Core/Behaviour/MouseUp"
import { WriteText } from "../../Core/Behaviour/WriteText"

class Panel {
    public constructor(parent: Simulator) {
        this.parent = parent
    }

    private parent!: Simulator

    private behaviours = ref<Array<{ type: Type.BehaviourType, actions: Array<Type.ActionType> }>>([
        {
            type: Type.BehaviourType.Mouse,
            actions: [Type.ActionType.MouseClick, Type.ActionType.MouseMove, Type.ActionType.MouseDown, Type.ActionType.MouseUp]
        },
        {
            type: Type.BehaviourType.Keyboard,
            actions: [Type.ActionType.KeyboardClick, Type.ActionType.KeyboardToggle]
        },
        {
            type: Type.BehaviourType.Write,
            actions: [Type.ActionType.WriteText]
        },
    ])

    private dragAction = Type.ActionType.None

    public InitStates() {
        return {
            behaviours: this.behaviours,
        }
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

    public OnDragStart(action: Type.ActionType) {
        this.dragAction = action
    }

    public OnDragEnd(e: DragEvent) {
        const position = this.parent.l.getInnerPoint({ x: e.clientX, y: e.clientY - 26 })
        this.parent.ToAddSelectAction(this.dragAction, position)
        this.dragAction = Type.ActionType.None
    }

    public OnClickRun() {
        this.RunAutomatic(this.parent.entities[0])
    }

    public OnClickSave() {

    }

    private async RunAutomatic(entities: Entity) {
        await this.TransformAction(entities)
        if (entities.O.next) {
            await this.RunAutomatic(entities.O.next)
        }
    }

    private TransformAction(entity: Entity) {
        return new Promise((resolve, reject) => {
            if (entity.type == Type.ActionType.None) {
                resolve("Action")
            }
            else {
                setTimeout(async () => {
                    switch (entity.type) {
                        case Type.ActionType.None:

                            break;
                        case Type.ActionType.MouseClick:
                            const mc = entity as MouseClick
                            await Renderer.Automatic.SetButtonClick(mc.O.button)
                            break;
                        case Type.ActionType.MouseMove:
                            const mm = entity as MouseMove
                            await Renderer.Automatic.SetMousePosition(mm.O.targetX, mm.O.targetY)
                            break;
                        case Type.ActionType.MouseDown:
                            const md = entity as MouseDown
                            await Renderer.Automatic.SetButtonToggle(md.O.button, true)
                            break;
                        case Type.ActionType.MouseUp:
                            const mu = entity as MouseUp
                            await Renderer.Automatic.SetButtonToggle(mu.O.button, false)
                            break;
                        case Type.ActionType.KeyboardClick:
                            const kc = entity as KeyboardClick
                            await Renderer.Automatic.SetKeysClick(kc.O.keys)
                            break;
                        case Type.ActionType.KeyboardToggle:
                            const kt = entity as KeyboardToggle
                            await Renderer.Automatic.SetKeysToggle(kt.O.keys)
                            break;
                        case Type.ActionType.WriteText:
                            const wt = entity as WriteText
                            await Renderer.Automatic.WriteText(wt.O.content, true)
                            break;
                        default:
                            break;
                    }
                    resolve("Action")
                }, 1000);
            }
        })

    }
}

export { Panel }