import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';
import { onMounted, onUnmounted } from 'vue';

namespace TWindow {
    /**
     * 是否保存大小
     */
    export let state = false;

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
                    if (!state) {
                        this.TWindow_State_Hooks();
                    }
                }

                private tWindow_Bind_Event!: Function;

                private timer = -1;

                private TWindow_State_Hooks() {
                    state = true;
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
                    await Renderer.Widget.SetSize(
                        parseInt(localStorage.getItem(`Application:${this.Route}:Width`) || '1000'),
                        parseInt(localStorage.getItem(`Application:${this.Route}:Height`) || '560')
                    );
                }

                private TWindow_State_ListenEvents() {
                    this.tWindow_Bind_Event = this.OnResized.bind(this);
                    //@ts-ignore
                    window.addEventListener('resize', this.tWindow_Bind_Event);
                }

                private async OnResized(e: UIEvent) {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        localStorage.setItem(`Application:${this.Route}:Width`, `${window.innerWidth}`);
                        localStorage.setItem(`Application:${this.Route}:Height`, `${window.innerHeight}`);
                    }, 300);
                }
            };
        };
    }
}

export { TWindow };
