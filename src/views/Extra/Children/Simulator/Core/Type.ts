
import { Simulator } from '../Simulator'
import { Entity } from './Behaviour/Entity'

namespace Type {
    export interface IEntity {
        simulator: Simulator,
        x?: number,
        y?: number,
        parent?: Entity,
        main?: boolean
        zIndex?: number
    }

    export interface IMouseClick extends IEntity {
        button: Renderer.Button
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
}

export { Type }