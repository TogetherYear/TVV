import { h, onMounted, onUnmounted, ref } from "vue"
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
import { Time } from "@/libs/Time"
import AvatarVue from '../Avatar/Avatar.vue'

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

    public async OnClickRun() {
        const form = this.TransformForm()
        for (let a of form) {
            await this.RunAction(a)
        }
    }

    public async OnClickSave() {
        const form = this.TransformForm()
        const r = JSON.stringify(form)
        const time = Time.GetTime(null, true, '-', '-').replaceAll(' ', '_')
        const path = await Renderer.Resource.GetPathByName(`Simulator/${time}.json`, false)
        Renderer.Resource.WriteStringToFile(path, r).then(res => {
            this.parent.audio.currentTime = 0
            this.parent.audio.play()
            Noti.success({
                title: "保存成功",
                content: `${path.split('/').slice(-1)[0]}`,
                closable: true,
                duration: 10000,
                avatar: () => h(AvatarVue, {
                    url: this.parent.avatarUrl,
                    width: 28,
                    height: 28
                })
            })
        })
    }

    private TransformForm() {
        const form: Type.Form = []
        this.DeepForm(this.parent.entities[0], form)
        return form
    }

    private DeepForm(entity: Entity, form: Type.Form) {
        switch (entity.type.value) {
            case Type.ActionType.Main:
                form.push({ type: Type.ActionType.Main, x: entity.body.x, y: entity.body.y, delay: this.parent.delay.value })
                break;
            case Type.ActionType.MouseClick:
                const mc = entity as MouseClick
                form.push({ type: Type.ActionType.MouseClick, button: mc.button.value, x: entity.body.x, y: entity.body.y })
                break;
            case Type.ActionType.MouseMove:
                const mm = entity as MouseMove
                form.push({ type: Type.ActionType.MouseMove, target: { x: mm.target.targetX, y: mm.target.targetY }, x: entity.body.x, y: entity.body.y })
                break;
            case Type.ActionType.MouseDown:
                const md = entity as MouseDown
                form.push({ type: Type.ActionType.MouseDown, button: md.button.value, x: entity.body.x, y: entity.body.y })
                break;
            case Type.ActionType.MouseUp:
                const mu = entity as MouseUp
                form.push({ type: Type.ActionType.MouseUp, button: mu.button.value, x: entity.body.x, y: entity.body.y })
                break;
            case Type.ActionType.KeyboardClick:
                const kc = entity as KeyboardClick
                form.push({ type: Type.ActionType.KeyboardClick, keys: kc.keys.value.map(k => k.key), x: entity.body.x, y: entity.body.y })
                break;
            case Type.ActionType.KeyboardToggle:
                const kt = entity as KeyboardToggle
                form.push({ type: Type.ActionType.KeyboardToggle, keys: kt.keys.value.map(k => { return { key: k.key, down: k.down } }), x: entity.body.x, y: entity.body.y })
                break;
            case Type.ActionType.WriteText:
                const wt = entity as WriteText
                form.push({ type: Type.ActionType.WriteText, content: wt.content.value, paste: wt.paste.value, x: entity.body.x, y: entity.body.y })
                break;
            default: break;
        }
        if (entity.O.next) {
            this.DeepForm(entity.O.next, form)
        }
    }

    private RunAction(action: Type.FormItem) {
        return new Promise((resolve, reject) => {
            if (action.type == Type.ActionType.Main) {
                resolve("Action")
            }
            else {
                setTimeout(async () => {
                    switch (action.type) {
                        case Type.ActionType.MouseClick:
                            await Renderer.Automatic.SetButtonClick(action.button)
                            break;
                        case Type.ActionType.MouseMove:
                            await Renderer.Automatic.SetMousePosition(action.target.x, action.target.y)
                            break;
                        case Type.ActionType.MouseDown:
                            await Renderer.Automatic.SetButtonToggle(action.button, true)
                            break;
                        case Type.ActionType.MouseUp:
                            await Renderer.Automatic.SetButtonToggle(action.button, false)
                            break;
                        case Type.ActionType.KeyboardClick:
                            await Renderer.Automatic.SetKeysClick(action.keys)
                            break;
                        case Type.ActionType.KeyboardToggle:
                            await Renderer.Automatic.SetKeysToggle(action.keys)
                            break;
                        case Type.ActionType.WriteText:
                            await Renderer.Automatic.WriteText(action.content, action.paste)
                            break;
                        default: break;
                    }
                    resolve("Action")
                }, this.parent.delay.value);
            }
        })

    }
}

export { Panel }