import { Time } from "@/libs/Time";
import { Type } from "../Type";
import * as L from 'leafer-ui'

abstract class Entity {
    constructor(options: Type.IEntity) {
        this.options = options
    }

    protected options!: Type.IEntity

    public id = Time.GenerateRandomUid()

    public body!: L.Box

    public delete!: L.Image

    public text!: L.Text

    public dragOrigin = {
        x: 0,
        y: 0
    }
}

export { Entity }