import { EventSystem } from '@/libs/EventSystem'

class GameLoop extends EventSystem {
    private constructor() { super() }

    private static instance: GameLoop = new GameLoop()

    public static get Instance() { return GameLoop.instance }

    public InitEvents() {
        this.AddKey("Awake")
        this.AddKey("Start")
        this.AddKey("Update")
    }

    public EmitAwake() {
        this.Emit('Awake')
    }

    public EmitStart() {
        this.Emit('Start')
    }

    private FrameUpdate() {
        window.requestAnimationFrame(this.FrameUpdate.bind(this))
        this.Emit("Update")
    }

    public Run() {
        this.EmitAwake()
        this.EmitStart()
        this.FrameUpdate()
    }
}

export { GameLoop }