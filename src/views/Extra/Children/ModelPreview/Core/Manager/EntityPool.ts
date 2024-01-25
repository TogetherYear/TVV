import { EventSystem } from "@/libs/EventSystem"
import { Entity } from "../Objects/Entity"
import { Type } from "../Type"
import { GameLoop } from "./Gameloop"
import { WebGLWorld } from "./WebGLWorld"

class EntityPool extends EventSystem {
    private entities: Array<Entity> = []

    private constructor() { super() }

    private static instance = new EntityPool()

    public static get Instance() {
        return this.instance
    }

    public Run() {
        this.RegisterEvents()
    }

    public AddToWorld(e: Entity) {
        this.entities.push(e)
        if (e.body) {
            WebGLWorld.Instance.scene?.add(e.body)
        }
    }

    private RegisterEvents() {
        for (let e of this.entities) {
            GameLoop.Instance.AddListen(Type.GLEvents.Awake, e, e.Awake)
            GameLoop.Instance.AddListen(Type.GLEvents.Start, e, e.Start)
            GameLoop.Instance.AddListen(Type.GLEvents.Update, e, e.Update)
        }
    }
}

export { EntityPool }