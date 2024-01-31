import { Entity } from "./Entity";
import { Type } from "../../Type";
import * as L from 'leafer-ui'
import { ref } from "vue";

class Main extends Entity {
    constructor(options: Type.IMain) {
        super(options)
        this.Create()
    }

    public type = ref<Type.ActionType>(Type.ActionType.Main)

    public override get O() {
        return this.options as Type.IMain
    }

    private Create() {
        this.body = new L.Box({
            width: 70,
            height: 36,
            cornerRadius: 3,
            x: this.O.x || 0,
            y: this.O.y || 0,
            cursor: 'pointer',
            fill: 'rgba(80,140,140,1.0)',
            zIndex: this.O.zIndex || 0,
        })

        this.text = new L.Text({
            fill: 'rgba(230,230,230,1.0)',
            text: `入口`,
            lineHeight: 36,
            width: 70,
            height: 36,
            textAlign: 'center',
            fontSize: 13,
            x: 0,
            y: 0
        })

        this.body.add(this.text)

        this.body.on_(L.PointerEvent.CLICK, this.OnClick, this)

        this.body.on_(L.DragEvent.DRAG, this.OnDragging, this)

        this.body.on_(L.DragEvent.START, this.OnStartDragging, this)

        this.O.simulator.l.add(this.body)

        this.O.simulator.entities.push(this)
    }

    public override OnStartDragging(e: L.DragEvent) {
        super.OnStartDragging(e)
    }

    public OnDragging(e: L.DragEvent) {
        super.OnDragging(e)
    }

    public OnClick(e: L.PointerEvent) {
        super.OnClick(e)
    }
}

export { Main }