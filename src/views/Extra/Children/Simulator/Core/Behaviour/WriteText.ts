import { Entity } from "./Entity";
import { Type } from "../Type";
import * as L from 'leafer-ui'
import deleteIcon from "@/assets/images/delete.png"

class WriteText extends Entity {
    constructor(options: Type.IWriteText) {
        super(options)
        this.Create()
    }

    public get O() {
        return this.options as Type.IWriteText
    }

    private Create() {
        this.body = new L.Box({
            width: 100,
            height: 36,
            cornerRadius: 3,
            cursor: 'pointer',
            fill: 'rgba(88,88,88,1.0)',
            zIndex: this.O.zIndex || 0,
        })

        this.text = new L.Text({
            fill: 'rgba(230,230,230,1.0)',
            text: `文本写入`,
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

        this.delete.on_(L.PointerEvent.CLICK, this.OnClickDelete, this)

        this.body.on_(L.PointerEvent.CLICK, this.OnClick, this)

        this.body.on_(L.DragEvent.DRAG, this.OnDragging, this)

        this.body.on_(L.DragEvent.START, this.OnStartDragging, this)

        this.body.on_(L.PointerEvent.ENTER, this.OnEnter, this)

        this.body.on_(L.PointerEvent.LEAVE, this.OnLeave, this)

        this.O.simulator.l.add(this.body)

        this.O.simulator.entities.push(this)
    }

    private OnStartDragging(e: L.DragEvent) {
        e.stopDefault()
        e.stop()
        this.dragOrigin.x = this.body.x
        this.dragOrigin.y = this.body.y
    }

    private OnDragging(e: L.DragEvent) {
        e.stopDefault()
        e.stop()
        this.body.x = this.dragOrigin.x + e.totalX
        this.body.y = this.dragOrigin.y + e.totalY
    }

    private OnClick(e: L.PointerEvent) {
        e.stopDefault()
        e.stop()
    }

    private OnEnter(e: L.PointerEvent) {
        e.stopDefault()
        e.stop()
        this.body.fill = 'rgba(120,120,120,1.0)'
    }

    private OnLeave(e: L.PointerEvent) {
        e.stopDefault()
        e.stop()
        this.body.fill = 'rgba(88,88,88,1.0)'
    }

    private OnClickDelete(e: L.PointerEvent) {
        e.stopDefault()
        e.stop()
        this.O.simulator.l.remove(this.body)
        this.O.simulator.entities = this.O.simulator.entities.filter(e => e.id != this.id)
    }
}

export { WriteText }