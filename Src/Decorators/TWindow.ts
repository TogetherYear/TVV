import { Component } from '@/Libs/Component';
import { Renderer } from '@/Plugins/Renderer';
import { onMounted, onUnmounted, ref } from 'vue';

namespace TWindow {
    let state = false;

    export const full = ref(false);

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
                        state = true;
                        this.TWindow_State_Hooks();
                    }
                }

                private tWindow_Bind_Event!: Function;

                private timer = -1;

                private TWindow_State_Hooks() {
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
                    await Renderer.Widget.SetSize(parseInt(localStorage.getItem(`${name}:${this.Route}:Width`) || '1000'), parseInt(localStorage.getItem(`${name}:${this.Route}:Height`) || '560'));
                    await Renderer.Widget.Center();
                    await Renderer.Widget.Show();
                }

                private TWindow_State_ListenEvents() {
                    this.tWindow_Bind_Event = this.OnResized.bind(this);
                    //@ts-ignore
                    window.addEventListener('resize', this.tWindow_Bind_Event);
                }

                private OnResized(e: UIEvent) {
                    clearTimeout(this.timer);
                    //@ts-ignore
                    this.timer = setTimeout(async () => {
                        const name = await Renderer.App.GetName();
                        if (!(await Renderer.Widget.IsFullscreen())) {
                            localStorage.setItem(`${name}:${this.Route}:Width`, `${window.innerWidth}`);
                            localStorage.setItem(`${name}:${this.Route}:Height`, `${window.innerHeight}`);
                            full.value = false;
                        } else {
                            full.value = true;
                        }
                    }, 300);
                }
            };
        };
    }
}

export { TWindow };
