import { EventSystem } from '@/libs/EventSystem'
import * as THREE from 'three'
import { GameLoop } from './Gameloop'
import { Type } from "../Type"

class Time extends EventSystem {
    private constructor() { super() }

    private static instance: Time = new Time()

    public static get Instance() { return Time.instance }

    public clock: THREE.Clock | null = null

    public deltaTime: number = 0

    public renderTime: number = 0

    public Run() {
        Time.Instance.clock = new THREE.Clock()
        this.ListenEvents()
    }

    private ListenEvents() {
        GameLoop.Instance.AddListen(Type.GLEvents.Update, this, this.Update)
    }

    private Update() {
        if (this.clock) {
            this.deltaTime = this.clock.getDelta()
            this.renderTime += this.deltaTime
        }
    }
}

export { Time }