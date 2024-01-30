
import { Simulator } from './Simulator'
import { Entity } from './Core/Behaviour/Entity'

namespace Type {
    export interface IEntity {
        simulator: Simulator,
        x?: number,
        y?: number,
        next?: Entity,
        zIndex?: number
    }

    export interface IMain extends IEntity {

    }

    export interface IMouseClick extends IEntity {
        button: Renderer.Button
    }

    export interface IKeyboardClick extends IEntity {
        keys: Array<Renderer.Key>
    }

    export interface IKeyboardToggle extends IEntity {
        keys: Array<{ key: Renderer.Key, down: boolean }>
    }

    export interface IIMouseDown extends IEntity {
        button: Renderer.Button
    }

    export interface IIMouseUp extends IEntity {
        button: Renderer.Button
    }

    export interface IWriteText extends IEntity {
        content: string
    }

    export interface IMouseMove extends IEntity {
        targetX: number,
        targetY: number
    }

    export enum BehaviourType {
        Mouse = "鼠标",
        Keyboard = "键盘",
        Write = "输入",
    }

    export enum ActionType {
        None = "None",
        MouseClick = "鼠标点击",
        MouseMove = "鼠标移到",
        MouseDown = "鼠标按下",
        MouseUp = "鼠标松开",
        KeyboardClick = "键盘点击",
        KeyboardToggle = "键盘状态",
        WriteText = "输入文本"

    }
}

export { Type }