namespace Type {
    export enum GLEvents {
        Awake = 'Awake',
        Start = 'Start',
        Update = 'Update',
    }

    export enum ISEvents {
        Resize = 'Resize',
        KeyDown = 'KeyDown',
        KeyUp = 'KeyUp',
        MouseMove = 'MouseMove',
        MouseDown = 'MouseDown',
        MouseUp = 'MouseUp',
        Wheel = 'Wheel',
        Pitch = 'Pitch',
        Yaw = 'Yaw'
    }

    export interface ILifeTimeEvent {
        Awake: () => void
        Start: () => void
        Update: () => void
        Destroy: () => void
    }

    export interface IComponentLifeTimeEvent {
        Awake: () => void
        Start: () => void
        Update: () => void
        Destroy: () => void
    }
}

export { Type }