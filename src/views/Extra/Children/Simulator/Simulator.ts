import { AActor } from "@/libs/AActor"
import { onMounted, onUnmounted, reactive, ref } from "vue"
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
import { Inspector } from "./Components/Inspector/Inspector"

class Simulator extends AActor {
    public constructor() {
        super()
    }

    private view = ref<HTMLSpanElement | null>(null)

    public l!: L.Leafer

    public entities: Array<Entity> = []

    public panel = new Panel(this)

    public inspector = new Inspector(this)

    public currentFocus = ref<Entity | null>(null)

    public delay = ref<number>(1000)

    public keys = ref<Array<{ text: string, value: number }>>([
        {
            text: 'Num0',
            value: 0
        },
        {
            text: 'Num1',
            value: 1
        },
        {
            text: 'Num2',
            value: 2
        },
        {
            text: 'Num3',
            value: 3
        },
        {
            text: 'Num4',
            value: 4
        },
        {
            text: 'Num5',
            value: 5
        },
        {
            text: 'Num6',
            value: 6
        },
        {
            text: 'Num7',
            value: 7
        },
        {
            text: 'Num8',
            value: 8
        },
        {
            text: 'Num9',
            value: 9
        },
        {
            text: 'A',
            value: 10
        },
        {
            text: 'B',
            value: 11
        },
        {
            text: 'C',
            value: 12
        },
        {
            text: 'D',
            value: 13
        },
        {
            text: 'E',
            value: 14
        },
        {
            text: 'F',
            value: 15
        },
        {
            text: 'G',
            value: 16
        },
        {
            text: 'H',
            value: 17
        },
        {
            text: 'I',
            value: 18
        },
        {
            text: 'J',
            value: 19
        },
        {
            text: 'K',
            value: 20
        },
        {
            text: 'L',
            value: 21
        },
        {
            text: 'M',
            value: 22
        },
        {
            text: 'N',
            value: 23
        },
        {
            text: 'O',
            value: 24
        },
        {
            text: 'P',
            value: 25
        },
        {
            text: 'Q',
            value: 26
        },
        {
            text: 'R',
            value: 27
        },
        {
            text: 'S',
            value: 28
        },
        {
            text: 'T',
            value: 29
        },
        {
            text: 'U',
            value: 30
        },
        {
            text: 'V',
            value: 31
        },
        {
            text: 'W',
            value: 32
        },
        {
            text: 'X',
            value: 33
        },
        {
            text: 'Y',
            value: 34
        },
        {
            text: 'Z',
            value: 35
        },
        {
            text: 'Add',
            value: 36
        },
        {
            text: 'Subtract',
            value: 37
        },
        {
            text: 'Multiply',
            value: 38
        },
        {
            text: 'Divide',
            value: 39
        },
        {
            text: 'OEM2',
            value: 40
        },
        {
            text: 'Tab',
            value: 41
        },
        {
            text: 'CapsLock',
            value: 42
        },
        {
            text: 'Shift',
            value: 43
        },
        {
            text: 'Control',
            value: 44
        },
        {
            text: 'Alt',
            value: 45
        },
        {
            text: 'Space',
            value: 46
        },
        {
            text: 'Backspace',
            value: 47
        },
        {
            text: 'Return',
            value: 48
        },
        {
            text: 'Escape',
            value: 49
        },
        {
            text: 'UpArrow',
            value: 50
        },
        {
            text: 'DownArrow',
            value: 51
        },
        {
            text: 'LeftArrow',
            value: 52
        },
        {
            text: 'RightArrow',
            value: 53
        },
    ])

    private audioUrl = ''

    public audio!: HTMLAudioElement

    public avatarUrl = ''

    public isSelect = ref<boolean>(false)

    public InitStates() {
        return {
            view: this.view,
            currentFocus: this.currentFocus,
            delay: this.delay,
            isSelect: this.isSelect,
            keys: this.keys,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(async () => {
            await this.GetDefaultResources()
            this.CreateLeafer()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private async GetDefaultResources() {
        this.audioUrl = await Renderer.Resource.GetPathByName('Musics/success.mp3')
        this.avatarUrl = await Renderer.Resource.GetPathByName('Images/icon.ico')
        this.audio = new Audio(this.audioUrl)
        this.audio.loop = false
        this.audio.volume = 1
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

            this.l.on_(L.PointerEvent.CLICK, this.OnClick, this)
        }
    }

    private OnClick(e: L.PointerEvent) {
        this.inspector.Hide()
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
                    targetX: 200,
                    targetY: 200
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
                    paste: true
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

    public OnClickSelectKey() {
        this.isSelect.value = !this.isSelect.value
    }
}

export { Simulator }