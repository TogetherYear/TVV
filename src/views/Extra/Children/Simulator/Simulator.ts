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
            this.ListenEvents()
        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    private ListenEvents() {
        Renderer.Widget.Listen(Renderer.Event.TauriEvent.WINDOW_FILE_DROP, async (e) => {
            const path: string = (e.payload as Array<string>)[0].replaceAll('\\', '/')
            const form = JSON.parse(await Renderer.Resource.ReadStringFromFile(path))
            this.LoadFileSimulator(form)
        })
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
        if (start) {
            start.Link(entity)
        }
    }

    public OnClickSelectKey() {
        this.isSelect.value = !this.isSelect.value
    }

    private LoadFileSimulator(form: Type.Form) {
        this.entities.splice(0, this.entities.length)
        this.isSelect.value = false
        this.currentFocus.value = null
        this.inspector.Hide()
        for (let a of form) {
            let entity: Entity | null = null
            switch (a.type) {
                case Type.ActionType.Main:
                    entity = new Main({
                        simulator: this,
                        x: a.x,
                        y: a.y,
                    })
                    this.delay.value = a.delay
                    break;
                case Type.ActionType.MouseClick:
                    entity = new MouseClick({
                        simulator: this,
                        button: Renderer.Button.Left,
                        x: a.x,
                        y: a.y,
                    })
                    break;
                case Type.ActionType.MouseMove:
                    entity = new MouseMove({
                        simulator: this,
                        x: a.x,
                        y: a.y,
                        targetX: a.target.x,
                        targetY: a.target.y
                    })
                    break;
                case Type.ActionType.MouseDown:
                    entity = new MouseDown({
                        simulator: this,
                        button: Renderer.Button.Left,
                        x: a.x,
                        y: a.y,
                    })
                    break;
                case Type.ActionType.MouseUp:
                    entity = new MouseUp({
                        simulator: this,
                        button: Renderer.Button.Left,
                        x: a.x,
                        y: a.y,
                    })
                    break;
                case Type.ActionType.KeyboardClick:
                    entity = new KeyboardClick({
                        simulator: this,
                        keys: a.keys,
                        x: a.x,
                        y: a.y,
                    })
                    break;
                case Type.ActionType.KeyboardToggle:
                    entity = new KeyboardToggle({
                        simulator: this,
                        keys: a.keys,
                        x: a.x,
                        y: a.y,
                    })
                    break;
                case Type.ActionType.WriteText:
                    entity = new WriteText({
                        simulator: this,
                        content: a.content,
                        x: a.x,
                        y: a.y,
                        paste: true
                    })
                    break;
                default: break;
            }
        }
        for (let i = 0; i < this.entities.length - 1; i++) {
            this.entities[i].Link(this.entities[i + 1])
        }
    }

    public TransformKey(key: Renderer.Key) {
        switch (key) {
            case Renderer.Key.Num0: return "Num0"
            case Renderer.Key.Num1: return "Num0"
            case Renderer.Key.Num2: return "Num0"
            case Renderer.Key.Num3: return "Num0"
            case Renderer.Key.Num4: return "Num0"
            case Renderer.Key.Num5: return "Num0"
            case Renderer.Key.Num6: return "Num0"
            case Renderer.Key.Num7: return "Num0"
            case Renderer.Key.Num8: return "Num0"
            case Renderer.Key.Num9: return "Num0"
            case Renderer.Key.A: return "Num0"
            case Renderer.Key.B: return "Num0"
            case Renderer.Key.C: return "Num0"
            case Renderer.Key.D: return "Num0"
            case Renderer.Key.E: return "Num0"
            case Renderer.Key.F: return "Num0"
            case Renderer.Key.G: return "Num0"
            case Renderer.Key.H: return "Num0"
            case Renderer.Key.I: return "Num0"
            case Renderer.Key.J: return "Num0"
            case Renderer.Key.K: return "Num0"
            case Renderer.Key.L: return "Num0"
            case Renderer.Key.M: return "Num0"
            case Renderer.Key.N: return "Num0"
            case Renderer.Key.O: return "Num0"
            case Renderer.Key.P: return "Num0"
            case Renderer.Key.Q: return "Num0"
            case Renderer.Key.R: return "Num0"
            case Renderer.Key.S: return "Num0"
            case Renderer.Key.T: return "Num0"
            case Renderer.Key.U: return "Num0"
            case Renderer.Key.V: return "Num0"
            case Renderer.Key.W: return "Num0"
            case Renderer.Key.X: return "Num0"
            case Renderer.Key.Y: return "Num0"
            case Renderer.Key.Z: return "Num0"
            case Renderer.Key.Add: return "Num0"
            case Renderer.Key.Subtract: return "Num0"
            case Renderer.Key.Multiply: return "Num0"
            case Renderer.Key.Divide: return "Num0"
            case Renderer.Key.OEM2: return "Num0"
            case Renderer.Key.Tab: return "Num0"
            case Renderer.Key.CapsLock: return "Num0"
            case Renderer.Key.Shift: return "Num0"
            case Renderer.Key.Control: return "Num0"
            case Renderer.Key.Alt: return "Num0"
            case Renderer.Key.Space: return "Num0"
            case Renderer.Key.Backspace: return "Num0"
            case Renderer.Key.Return: return "Num0"
            case Renderer.Key.Escape: return "Num0"
            case Renderer.Key.UpArrow: return "Num0"
            case Renderer.Key.DownArrow: return "Num0"
            case Renderer.Key.LeftArrow: return "Num0"
            case Renderer.Key.RightArrow: return "Num0"
            default: return "T"
        }
    }
}

export { Simulator }