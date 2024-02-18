import { EventSystem } from "@/libs/EventSystem"
import { GameLoop } from "./Gameloop"
import { WebGLWorld } from "./WebGLWorld"
import { Type } from "../Type"

class InputSystem extends EventSystem {
    public mouseFlag = { LEFT: false, MID: false, RIGHT: false }

    public currentMouseMovePosition = { x: 0, y: 0 }

    public currentMouseEnterPosition = { x: 0, y: 0 }

    public directionFlag = { W: false, S: false, A: false, D: false, Q: false, E: false, SHIFT: false }

    private constructor() { super() }

    private static instance = new InputSystem()

    public static get Instance() {
        return this.instance
    }

    public Run() {
        this.InitEvents()
        this.ListenEvents()
    }

    private InitEvents() {
        this.AddKey('Resize')
        this.AddKey('KeyDown')
        this.AddKey('KeyUp')
        this.AddKey('MouseMove')
        this.AddKey('MouseDown')
        this.AddKey('MouseUp')
        this.AddKey('Wheel')
        this.AddKey('Pitch')
        this.AddKey('Yaw')
    }

    private ListenEvents() {
        GameLoop.Instance.AddListen(Type.GLEvents.Update, this, this.Update)
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            e.stopPropagation()
        })
        window.addEventListener('resize', this.OnWindowResize.bind(this), false)
        window.addEventListener('keydown', this.OnMoveKeyPress.bind(this), false)
        window.addEventListener('keyup', this.OnMoveKeyRelease.bind(this), false)
        window.addEventListener('mousemove', this.OnMouseMove.bind(this), false)
        window.addEventListener('mousedown', this.OnMouseDown.bind(this), false)
        window.addEventListener('mouseup', this.OnMouseUp.bind(this), false)
        window.addEventListener('wheel', this.OnWheel.bind(this))
    }

    private Update() {

    }

    private OnWindowResize(e: UIEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (WebGLWorld.Instance.scene && WebGLWorld.Instance.camera && WebGLWorld.Instance.renderer) {
            let element = document.getElementById('WebGLWorldContainer') as HTMLSpanElement
            WebGLWorld.Instance.camera.aspect = element.offsetWidth / element.offsetHeight
            WebGLWorld.Instance.camera.updateProjectionMatrix()
            WebGLWorld.Instance.renderer.setSize(element.offsetWidth, element.offsetHeight)
            WebGLWorld.Instance.renderer.render(WebGLWorld.Instance.scene, WebGLWorld.Instance.camera)
        }
        this.Emit('Resize')
    }

    private OnMoveKeyPress(e: KeyboardEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (e.key == 'W' || e.key == 'w') {
            this.directionFlag.W = true
        } else if (e.key == 'S' || e.key == 's') {
            this.directionFlag.S = true
        } else if (e.key == 'A' || e.key == 'a') {
            this.directionFlag.A = true
        } else if (e.key == 'D' || e.key == 'd') {
            this.directionFlag.D = true
        } else if (e.key == 'Q' || e.key == 'q' || e.key == 'Control') {
            this.directionFlag.Q = true
        } else if (e.key == 'E' || e.key == 'e' || e.key == ' ') {
            this.directionFlag.E = true
        } else if (e.key == 'Shift') {
            this.directionFlag.SHIFT = true
        }
        this.Emit('KeyDown', { key: e.key })
    }

    private OnMoveKeyRelease(e: KeyboardEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (e.key == 'W' || e.key == 'w') {
            this.directionFlag.W = false
        } else if (e.key == 'S' || e.key == 's') {
            this.directionFlag.S = false
        } else if (e.key == 'A' || e.key == 'a') {
            this.directionFlag.A = false
        } else if (e.key == 'D' || e.key == 'd') {
            this.directionFlag.D = false
        } else if (e.key == 'Q' || e.key == 'q' || e.key == 'Control') {
            this.directionFlag.Q = false
        } else if (e.key == 'E' || e.key == 'e' || e.key == ' ') {
            this.directionFlag.E = false
        } else if (e.key == 'Shift') {
            this.directionFlag.SHIFT = false
        }
        this.Emit('KeyUp', { key: e.key })
    }

    private OnMouseMove(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        this.currentMouseMovePosition.x = e.x
        this.currentMouseMovePosition.y = e.y
        if (this.mouseFlag.RIGHT) {
            this.Emit('Yaw', { key: e.clientX - this.currentMouseEnterPosition.x })
            this.Emit('Pitch', { key: e.clientY - this.currentMouseEnterPosition.y })
            this.currentMouseEnterPosition.x = e.clientX
            this.currentMouseEnterPosition.y = e.clientY
        }
        this.Emit('MouseMove', { x: e.clientX, y: e.clientY })
    }

    private OnMouseDown(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (e.button === 0) {
            this.mouseFlag.LEFT = true
        }
        else if (e.button === 1) {
            this.mouseFlag.MID = true
        }
        else if (e.button === 2) {
            this.currentMouseEnterPosition.x = e.clientX
            this.currentMouseEnterPosition.y = e.clientY
            this.mouseFlag.RIGHT = true
        }
        this.Emit('MouseDown', { key: e.button })
    }

    private OnMouseUp(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (e.button === 0) {
            this.mouseFlag.LEFT = false
        }
        else if (e.button === 1) {
            this.mouseFlag.MID = false
        }
        else if (e.button === 2) {
            this.mouseFlag.RIGHT = false
        }
        this.Emit('MouseUp', { key: e.button })
    }

    private OnWheel(e: WheelEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (e.deltaY > 0) {

        } else {

        }
        this.Emit('Wheel', { key: e.deltaY })
    }
}

export { InputSystem }