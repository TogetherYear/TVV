import * as THREE from "three"
import { GameLoop } from "../Manager/Gameloop"
import { InputSystem } from "../Manager/InputSystem"
import { Time } from "../Manager/Time"
import { WebGLWorld } from "../Manager/WebGLWorld"
import { Entity } from "../Objects/Entity"
import { Type } from "../Type"

class Character extends Entity {

    public constructor() { super() }

    private moveSpeed = 6

    private rotateSpeed = 0.24

    private wheelSpeed = 12

    private speedScale = 1

    private DIRECTION = {
        UP: new THREE.Vector3(0, 1, 0),
        DOWN: new THREE.Vector3(0, -1, 0),
        FORWARD: new THREE.Vector3(0, 0, -1),
        BEHIND: new THREE.Vector3(0, 0, 1),
        LEFT: new THREE.Vector3(-1, 0, 0),
        RIGHT: new THREE.Vector3(1, 0, 0)
    }

    public Awake() {
        this.ListenEvents()
    }

    private ListenEvents() {
        GameLoop.Instance.AddListen(Type.GLEvents.Update, this, this.Update)
        InputSystem.Instance.AddListen(Type.ISEvents.Pitch, this, this.OnPitch)
        InputSystem.Instance.AddListen(Type.ISEvents.Yaw, this, this.OnYaw)
        InputSystem.Instance.AddListen(Type.ISEvents.Wheel, this, this.OnWheel)
    }

    public Update() {
        this.UpdateCameraPosition()
    }

    private UpdateCameraPosition() {
        if (InputSystem.Instance.mouseFlag.RIGHT) {
            if (InputSystem.Instance.directionFlag.W) {
                WebGLWorld.Instance.camera?.translateZ(-this.moveSpeed * this.speedScale * Time.Instance.deltaTime)
            }
            if (InputSystem.Instance.directionFlag.S) {
                WebGLWorld.Instance.camera?.translateZ(this.moveSpeed * this.speedScale * Time.Instance.deltaTime)
            }
            if (InputSystem.Instance.directionFlag.A) {
                WebGLWorld.Instance.camera?.translateX(-this.moveSpeed * this.speedScale * Time.Instance.deltaTime)
            }
            if (InputSystem.Instance.directionFlag.D) {
                WebGLWorld.Instance.camera?.translateX(this.moveSpeed * this.speedScale * Time.Instance.deltaTime)
            }
            if (InputSystem.Instance.directionFlag.Q) {
                WebGLWorld.Instance.camera?.translateY(-this.moveSpeed * this.speedScale * Time.Instance.deltaTime)
            }
            if (InputSystem.Instance.directionFlag.E) {
                WebGLWorld.Instance.camera?.translateY(this.moveSpeed * this.speedScale * Time.Instance.deltaTime)
            }
            if (InputSystem.Instance.directionFlag.SHIFT) {
                this.speedScale = 2
            }
            else {
                this.speedScale = 1
            }
        }
    }

    private OnPitch(e: { key: number }) {
        WebGLWorld.Instance.camera?.rotateOnAxis(
            this.DIRECTION.LEFT,
            this.rotateSpeed *
            this.speedScale *
            e.key *
            Time.Instance.deltaTime
        )
    }

    private OnYaw(e: { key: number }) {
        WebGLWorld.Instance.camera?.rotateOnWorldAxis(
            this.DIRECTION.DOWN,
            this.rotateSpeed *
            this.speedScale *
            e.key *
            Time.Instance.deltaTime
        )
    }

    private OnWheel(e: { key: number }) {
        if (e.key > 0) {
            WebGLWorld.Instance.camera?.translateOnAxis(this.DIRECTION.BEHIND, this.wheelSpeed * this.speedScale * Time.Instance.deltaTime)
        }
        else {
            WebGLWorld.Instance.camera?.translateOnAxis(this.DIRECTION.FORWARD, this.wheelSpeed * this.speedScale * Time.Instance.deltaTime)
        }
    }
}

export { Character }