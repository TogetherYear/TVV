import { EventSystem } from '@/libs/EventSystem'
import * as THREE from 'three'
import { EntityPool } from '../Manager/EntityPool'
import { Type } from "../Type"

/**
 * 物体基类
 */
abstract class Entity extends EventSystem implements Type.ILifeTimeEvent {
    /**
     * 物体容器
     */
    public body: THREE.Object3D | null = null

    constructor() {
        super()
        this.Init()
    }

    /**
     * 初始化物体
     */
    public Init() {
        this.body = new THREE.Object3D()
        EntityPool.Instance.AddToWorld(this)
    }

    /**
     * 唤醒时执行
     */
    public Awake() {

    }

    /**
     * 唤醒后执行
     */
    public Start() {

    }

    /**
     * 每帧执行
     */
    public Update() {

    }

    /**
     * 销毁时执行
     */
    public Destroy() {

    }

}

export { Entity }