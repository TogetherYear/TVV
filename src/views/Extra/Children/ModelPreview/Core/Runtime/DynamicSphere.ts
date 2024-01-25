import { ShpereRigidBody } from "../Components/SphereRigidBody"
import { Sphere } from "./Sphere"

class DynamicSphere extends Sphere {
    public constructor() {
        super()
        this.body?.position.set(5, 5, 0)
        this.components.push(new ShpereRigidBody(this, 100))
    }

}

export { DynamicSphere }