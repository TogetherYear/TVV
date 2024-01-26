import { EventSystem } from "@/libs/EventSystem"
import { Plane } from "../Runtime/Plane"
import { Box } from "../Runtime/Box"
import { Character } from "../Runtime/Character"
import { Sphere } from "../Runtime/Sphere"

class Generate extends EventSystem {
    private constructor() { super() }

    private static instance = new Generate()

    public static get Instance() {
        return this.instance
    }

    public Run() {
        new Character()
        new Plane()
        new Box()
        new Sphere()
    }
}

export { Generate }