import { EventSystem } from '@/libs/EventSystem'
import * as THREE from 'three'
import { EntityPool } from '../Manager/EntityPool'
import { Type } from "../Type"
import { Component } from './Component'


/**
 * 物体基类
 */
abstract class Entity extends EventSystem implements Type.ILifeTimeEvent {
    /**
     * 物体容器
     */
    public body: THREE.Object3D | null = null

    public components: Array<Component> = []

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
        for (let c of this.components) {
            c.Awake()
        }
    }

    /**
     * 唤醒后执行
     */
    public Start() {
        for (let c of this.components) {
            c.Start()
        }
    }

    /**
     * 每帧执行
     */
    public Update() {
        for (let c of this.components) {
            c.Update()
        }
    }

    /**
     * 销毁时执行
     */
    public Destroy() {
        for (let c of this.components) {
            c.Destroy()
        }
    }

}

export { Entity }