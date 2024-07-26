import { EventSystem } from './Libs/EventSystem';
import { onMounted, onUnmounted, ref } from 'vue';

class App extends EventSystem {
    public isMax = ref<boolean>(false);

    public InitStates() {
        return {
            isMax: this.isMax
        };
    }

    public InitHooks() {}

    public Run() {
        onMounted(() => {});

        onUnmounted(() => {
            this.Destroy();
        });
    }

    protected Destroy() {}
}

const AppInstance = new App();

export { AppInstance as App };
