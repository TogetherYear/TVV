import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';
import { onMounted, onUnmounted, ref } from 'vue';

namespace TWindow {
    let init = false;

    export const enum WindowState {
        Default,
        Full
    }

    /**
     * 当前窗口状态
     */
    export let currentState = ref<WindowState>(WindowState.Default);

    export function Generate() {
        return function <T extends new (...args: Array<any>) => Component>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TWindow_Generate_Hooks();
                }

                private TWindow_Generate_Hooks() {}
            };
        };
    }

    /**
     * 保存窗口大小 给窗口中的任意一个 Component 挂载上即可
     */
    export function State() {
        return function <T extends new (...args: Array<any>) => Component>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    if (!init) {
                        this.TWindow_State_Hooks();
                    }
                }

                private tWindow_Bind_Event!: Function;

                private timer = -1;

                private TWindow_State_Hooks() {
                    init = true;
                    onMounted(async () => {
                        await this.TWindow_State_SetDefault();
                        this.TWindow_State_ListenEvents();
                    });

                    onUnmounted(() => {
                        //@ts-ignore
                        window.removeEventListener('resize', this.tWindow_Bind_Event);
                    });
                }

                private async TWindow_State_SetDefault() {
                    const name = await Renderer.App.GetName();
                    const full = localStorage.getItem(`${name}:${this.Route}:Full`) || '0';
                    if (full === '1') {
                        currentState.value = WindowState.Full;
                        await Renderer.Widget.SetFullscreen(true);
                        await Renderer.Widget.SetResizable(false);
                    } else {
                        currentState.value = WindowState.Default;
                        await Renderer.Widget.SetSize(parseInt(localStorage.getItem(`${name}:${this.Route}:Width`) || '1000'), parseInt(localStorage.getItem(`${name}:${this.Route}:Height`) || '560'));
                    }
                }

                private TWindow_State_ListenEvents() {
                    this.tWindow_Bind_Event = this.OnResized.bind(this);
                    //@ts-ignore
                    window.addEventListener('resize', this.tWindow_Bind_Event);
                }

                private OnResized(e: UIEvent) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(async () => {
                        const full = await Renderer.Widget.GetFullscreen();
                        const name = await Renderer.App.GetName();
                        currentState.value = full ? WindowState.Full : WindowState.Default;
                        localStorage.setItem(`${name}:${this.Route}:Full`, `${full ? '1' : '0'}`);
                        localStorage.setItem(`${name}:${this.Route}:Width`, `${window.innerWidth}`);
                        localStorage.setItem(`${name}:${this.Route}:Height`, `${window.innerHeight}`);
                    }, 300);
                }
            };
        };
    }
}

export { TWindow };
