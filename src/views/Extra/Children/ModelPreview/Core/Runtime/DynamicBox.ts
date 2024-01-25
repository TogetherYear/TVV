import { BoxRigidBody } from "../Components/BoxRigidBody"
import { Box } from "./Box"

class DynamicBox extends Box {

    public constructor() {
        super()
        this.body?.position.set(0, 5, 0)
        this.components.push(new BoxRigidBody(this, 100))
    }

}

export { DynamicBox }