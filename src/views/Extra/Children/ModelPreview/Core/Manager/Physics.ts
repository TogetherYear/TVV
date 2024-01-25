import { EventSystem } from "@/libs/EventSystem"
import { Type } from "../Type"
import { GameLoop } from "./Gameloop"
import { Time } from "./Time"

class Physics extends EventSystem {
    constructor() {
        super()
    }

    /**
     * 物理设置
     */
    private collisionConfiguration: Ammo.btDefaultCollisionConfiguration | null = null

    /**
     * 分配器
     */
    private dispatcher: Ammo.btCollisionDispatcher | null = null

    /**
     * 宽相
     */
    private broadphase: Ammo.btDbvtBroadphase | null = null

    /**
     * 解算器
     */
    private solver: Ammo.btSequentialImpulseConstraintSolver | null = null

    /**
     * 物理世界
     */
    public physicsWorld: Ammo.btDiscreteDynamicsWorld | null = null

    private static instance: Physics = new Physics()

    public static get Instance() { return Physics.instance }

    public Run() {
        return new Promise((resolve, reject) => {
            Ammo().then(lib => {
                // console.log(lib)
                this.InitCollision()
                this.ListenEvent()
                resolve("PhysicsOver")
            })
        })
    }

    private InitCollision() {
        this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
        this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration)
        this.broadphase = new Ammo.btDbvtBroadphase()
        this.solver = new Ammo.btSequentialImpulseConstraintSolver()
        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.broadphase, this.solver, this.collisionConfiguration)
        this.physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0))
    }

    private PhysicsSimulation() {
        this.physicsWorld?.stepSimulation(Time.Instance.deltaTime, 10)
    }

    private ListenEvent() {
        GameLoop.Instance.AddListen(Type.GLEvents.Update, this, this.PhysicsSimulation)
    }
}

export { Physics }