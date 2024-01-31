import { Time } from "@/libs/Time";
import { Type } from "../../Type";
import * as L from 'leafer-ui'
import { ref } from "vue";

abstract class Entity {
    constructor(options: Type.IEntity) {
        this.options = options
    }

    public type = ref<Type.ActionType>(Type.ActionType.None)

    protected options!: Type.IEntity

    public get O() {
        return this.options as Type.IEntity
    }

    public id = Time.GenerateRandomUid()

    public body!: L.Box

    public delete!: L.Image

    public text!: L.Text

    public line!: L.Line

    public dragOrigin = {
        x: 0,
        y: 0
    }

    public Link(next: Entity) {
        this.O.next = next
        this.line = new L.Line({
            points: [
                this.body.x + this.body.width - 18,
                this.body.y + this.body.height / 2,
                next.body.x + 18,
                next.body.y + next.body.height / 2
            ],
            zIndex: -1,
            strokeWidth: 5,
            stroke: 'rgba(140,80,80,1.0)'
        })
        this.O.simulator.l.add(this.line)
    }

    public OnStartDragging(e: L.DragEvent) {
        e.stopDefault()
        e.stop()
        this.dragOrigin.x = this.body.x
        this.dragOrigin.y = this.body.y
    }

    public OnDragging(e: L.DragEvent) {
        e.stopDefault()
        e.stop()
        this.body.x = this.dragOrigin.x + e.totalX
        this.body.y = this.dragOrigin.y + e.totalY
        if (this.line && this.O.next) {
            this.line.points = [
                this.body.x + this.body.width - 18,
                this.body.y + this.body.height / 2,
                this.O.next.body.x + 18,
                this.O.next.body.y + this.O.next.body.height / 2
            ]
        }
        const pre = this.O.simulator.entities.find(e => e.O.next?.id == this.id)
        if (pre && pre.line) {
            pre.line.points = [
                pre.body.x + pre.body.width - 18,
                pre.body.y + pre.body.height / 2,
                this.body.x + 18,
                this.body.y + this.body.height / 2
            ]
        }
    }

    public OnClick(e: L.PointerEvent) {
        e.stopDefault()
        e.stop()
        if (this.type.value != Type.ActionType.None) {
            ///@ts-ignore
            this.O.simulator.currentFocus.value = this
            this.O.simulator.isSelect.value = false
            this.O.simulator.inspector.Show()
        }
    }

    public OnDelete(e: L.PointerEvent) {
        e.stopDefault()
        e.stop()
        this.O.simulator.l.remove(this.body)
        this.O.simulator.entities = this.O.simulator.entities.filter(e => e.id != this.id)
        const pre = this.O.simulator.entities.find(e => e.O.next?.id == this.id)
        if (pre) {
            this.O.simulator.l.remove(pre.line)
            pre.O.next = undefined
            if (this.O.next) {
                pre.Link(this.O.next)
            }
        }
        if (this.line) {
            this.O.simulator.l.remove(this.line)
        }
        this.O.simulator.inspector.Hide()
        this.O.simulator.isSelect.value = false
        this.O.simulator.currentFocus.value = null
    }

    public OnEnter(e: L.PointerEvent) {
        e.stopDefault()
        e.stop()
        this.body.fill = 'rgba(120,120,120,1.0)'
    }

    public OnLeave(e: L.PointerEvent) {
        e.stopDefault()
        e.stop()
        this.body.fill = 'rgba(88,88,88,1.0)'
    }
}

export { Entity }