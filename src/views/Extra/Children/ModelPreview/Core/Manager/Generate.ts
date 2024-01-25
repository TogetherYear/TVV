import { EventSystem } from "@/libs/EventSystem"
import { Plane } from "../Runtime/Plane"
import { Character } from "../Runtime/Character"
import { DynamicBox } from "../Runtime/DynamicBox"
import { DynamicSphere } from "../Runtime/DynamicSphere"

class Generate extends EventSystem {
    private constructor() { super() }

    private static instance = new Generate()

    public static get Instance() {
        return this.instance
    }

    public Run() {
        new Character()
        new Plane()
        new DynamicBox()
        new DynamicSphere()
    }
}

export { Generate }