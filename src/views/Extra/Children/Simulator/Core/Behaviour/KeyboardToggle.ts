import { Entity } from "./Entity";
import { Type } from "../../Type";
import * as L from 'leafer-ui'
import deleteIcon from "@/assets/images/delete.png"
import { ref } from "vue";

class KeyboardToggle extends Entity {
    constructor(options: Type.IKeyboardToggle) {
        super(options)
        this.keys.value = this.keys.value.splice(0, this.keys.value.length, ...options.keys)
        this.Create()
    }

    public type = Type.ActionType.KeyboardToggle

    public keys = ref<Array<{ key: Renderer.Key, down: boolean }>>([])

    public override get O() {
        return this.options as Type.IKeyboardToggle
    }

    private Create() {
        this.body = new L.Box({
            width: 100,
            height: 36,
            cornerRadius: 3,
            x: this.O.x || 0,
            y: this.O.y || 0,
            cursor: 'pointer',
            fill: 'rgba(88,88,88,1.0)',
            zIndex: this.O.zIndex || 0,
        })

        this.text = new L.Text({
            fill: 'rgba(230,230,230,1.0)',
            text: `按键状态`,
            lineHeight: 36,
            width: 70,
            height: 36,
            textAlign: 'center',
            fontSize: 13,
            x: 0,
            y: 0
        })

        this.body.add(this.text)

        this.delete = new L.Image({
            width: 24,
            height: 24,
            url: deleteIcon,
            x: 70,
            y: 6,
        })

        this.body.add(this.delete)

        this.delete.on_(L.PointerEvent.CLICK, this.OnDelete, this)

        this.body.on_(L.PointerEvent.CLICK, this.OnClick, this)

        this.body.on_(L.DragEvent.DRAG, this.OnDragging, this)

        this.body.on_(L.DragEvent.START, this.OnStartDragging, this)

        this.body.on_(L.PointerEvent.ENTER, this.OnEnter, this)

        this.body.on_(L.PointerEvent.LEAVE, this.OnLeave, this)

        this.O.simulator.l.add(this.body)

        this.O.simulator.entities.push(this)
    }

    public OnStartDragging(e: L.DragEvent) {
        super.OnStartDragging(e)
    }

    public OnDragging(e: L.DragEvent) {
        super.OnDragging(e)
    }

    public OnClick(e: L.PointerEvent) {
        super.OnClick(e)
    }

    public OnEnter(e: L.PointerEvent) {
        super.OnEnter(e)
    }

    public OnLeave(e: L.PointerEvent) {
        super.OnLeave(e)
    }

    public override OnDelete(e: L.PointerEvent): void {
        super.OnDelete(e)
    }

}

export { KeyboardToggle }