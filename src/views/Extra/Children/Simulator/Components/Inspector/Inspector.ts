import { onMounted, onUnmounted, ref } from "vue"
import { Simulator } from "../../Simulator"
import { Entity } from "../../Core/Behaviour/Entity"

class Inspector {
    public constructor(parent: Simulator) {
        this.parent = parent
    }

    private parent!: Simulator

    public isShow = ref<boolean>(false)

    public InitStates() {
        return {
            isShow: this.isShow,
        }
    }

    public InitHooks() {

    }

    public Run() {
        onMounted(() => {

        })

        onUnmounted(() => {
            this.Destroy()
        })
    }

    protected Destroy() {

    }

    public Show() {
        this.isShow.value = true
    }

    public Hide() {
        this.isShow.value = false
    }
}

export { Inspector }