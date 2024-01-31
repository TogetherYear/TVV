
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
        content: string,
        paste: boolean
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
        Main = "入口",
        MouseClick = "鼠标点击",
        MouseMove = "鼠标移到",
        MouseDown = "鼠标按下",
        MouseUp = "鼠标松开",
        KeyboardClick = "键盘点击",
        KeyboardToggle = "键盘状态",
        WriteText = "输入文本"

    }

    export type Form = Array<FormItem>

    export type FormItem = (Main | MouseClick | MouseMove | MouseDown | MouseUp | KeyboardClick | KeyboardToggle | WriteText) & { x: number, y: number }

    export type Main = {
        type: ActionType.Main,
        delay: number
    }

    export type MouseClick = {
        type: ActionType.MouseClick,
        button: Renderer.Button
    }

    export type MouseMove = {
        type: ActionType.MouseMove,
        target: { x: number, y: number }
    }

    export type MouseDown = {
        type: ActionType.MouseDown,
        button: Renderer.Button
    }

    export type MouseUp = {
        type: ActionType.MouseUp,
        button: Renderer.Button
    }

    export type KeyboardClick = {
        type: ActionType.KeyboardClick,
        keys: Array<Renderer.Key>
    }

    export type KeyboardToggle = {
        type: ActionType.KeyboardToggle,
        keys: Array<{ key: Renderer.Key, down: boolean }>
    }

    export type WriteText = {
        type: ActionType.WriteText,
        content: string,
        paste: boolean
    }
}

export { Type }