import { EventSystem } from "@/libs/EventSystem";
import { Type } from "../Type"
import { Entity } from "./Entity";

/**
 * 组件基类
 */
abstract class Component extends EventSystem implements Type.IComponentLifeTimeEvent {
    constructor(parent: Entity) {
        super()
        this.parent = parent
    }

    public parent: Entity | null = null


    /**
     * 组件唤醒前
     */
    public Awake() {

    }

    /**
     * 组件唤醒后执行
     */
    public Start() {

    }

    /**
     * 组件每帧执行
     */
    public Update() {

    }

    /**
     * 组件销毁时执行
     */
    public Destroy() {

    }
}

export { Component }