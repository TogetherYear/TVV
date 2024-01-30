import { onMounted, onUnmounted, ref } from "vue"
import { Simulator } from "../../Simulator"
import { Type } from "../../Type"

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
}

export { Panel }