import { Component } from '@/Libs/Component';
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

namespace TComponent {
    export const ComponentMap = new Map<string, Array<Object>>();

    export function Generate() {
        return function <T extends new (...args: Array<any>) => Component>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args);
                    this.TComponent_Generate_Hooks();
                    this.Mount();
                }

                private TComponent_Generate_Hooks() {
                    this.TManager_Generate_Page();
                    onMounted(() => {
                        let currentMap = ComponentMap.get(this.tComponent_Generate_Route);
                        if (!currentMap) {
                            currentMap = [];
                            ComponentMap.set(this.tComponent_Generate_Route, currentMap);
                        }
                        currentMap.push(this);
                    });

                    onUnmounted(() => {
                        let currentMap = ComponentMap.get(this.tComponent_Generate_Route);
                        if (currentMap) {
                            const index = currentMap.findIndex((c) => c === this);
                            if (index !== -1) {
                                currentMap.splice(index, 1);
                            }
                        }
                    });
                }

                private TManager_Generate_Page() {
                    const route = useRoute();
                    this.tComponent_Generate_Route = route.path;
                    this.tComponent_Generate_Query = { ...route.query };
                }

                private Mount() {
                    //@ts-ignore
                    if (!window.ComponentMap) {
                        //@ts-ignore
                        window.ComponentMap = ComponentMap;
                    }
                }
            };
        };
    }
}

export { TComponent };
