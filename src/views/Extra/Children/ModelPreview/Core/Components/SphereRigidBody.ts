import { Component } from "../Objects/Component";
import { Entity } from "../Objects/Entity";
import * as THREE from 'three'
import { Physics } from "../Manager/Physics";

class ShpereRigidBody extends Component {
    constructor(parent: Entity, mass: number = 100) {
        super(parent)
        this.CreateSphere(mass)
    }

    private transform: Ammo.btTransform | null = null

    private tempTransform: Ammo.btTransform | null = null

    private motionState: Ammo.btDefaultMotionState | null = null

    private shape: Ammo.btSphereShape | null = null

    private inertia: Ammo.btVector3 | null = null

    private info: Ammo.btRigidBodyConstructionInfo | null = null

    public body: Ammo.btRigidBody | null = null

    // FIXME: mass 等于 0 的话 表示该物体不会被撞开 
    private CreateSphere(mass: number = 100) {
        if (this.parent && this.parent.body) {
            let pos = this.parent.body.position
            let quat = this.parent.body.quaternion
            let size = this.parent.body.scale
            this.transform = new Ammo.btTransform()
            this.tempTransform = new Ammo.btTransform()
            this.transform.setIdentity()
            this.transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
            this.transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))
            this.motionState = new Ammo.btDefaultMotionState(this.transform)
            this.shape = new Ammo.btSphereShape(size.x / 2)
            this.shape.setMargin(0.05)
            this.inertia = new Ammo.btVector3(0, 0, 0)
            if (mass > 0) {
                this.shape.calculateLocalInertia(mass, this.inertia)
            }
            this.info = new Ammo.btRigidBodyConstructionInfo(mass, this.motionState, this.shape, this.inertia)
            this.body = new Ammo.btRigidBody(this.info)

            this.SetRestitution(0.6)
            this.SetFriction(1)
            this.SetRollingFriction(1)

            Physics.Instance.physicsWorld?.addRigidBody(this.body)
        }
    }

    private SetRestitution(val: number) {
        this.body?.setRestitution(val);
    }

    private SetFriction(val: number) {
        this.body?.setFriction(val);
    }

    private SetRollingFriction(val: number) {
        this.body?.setRollingFriction(val);
    }

    public Update() {
        this.motionState?.getWorldTransform(this.tempTransform as Ammo.btTransform)
        const pos = this.tempTransform?.getOrigin()
        const quat = this.tempTransform?.getRotation()
        if (pos && quat) {
            const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z())
            const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w())
            this.parent?.body?.position.copy(pos3)
            this.parent?.body?.quaternion.copy(quat3)
        }
    }

    public Destroy() {
        if (Physics.Instance.physicsWorld && this.transform && this.tempTransform && this.motionState && this.shape && this.inertia && this.info && this.body) {
            Physics.Instance.physicsWorld.removeRigidBody(this.body)
            Ammo.destroy(this.transform)
            Ammo.destroy(this.tempTransform)
            Ammo.destroy(this.motionState)
            Ammo.destroy(this.shape)
            Ammo.destroy(this.inertia)
            Ammo.destroy(this.info)
            Ammo.destroy(this.body)
            this.transform = null
            this.tempTransform = null
            this.motionState = null
            this.shape = null
            this.inertia = null
            this.info = null
            this.body = null
        }
    }
}

export { ShpereRigidBody }