import { onMounted, onUnmounted } from "vue"

namespace DR {
    export function ClassDec() {
        return function <T extends new (...args: Array<any>) => Object>(C: T) {
            return class extends C {
                constructor(...args: Array<any>) {
                    super(...args)
                    this.Hooks()
                }

                private Hooks() {
                    onMounted(() => {

                    })

                    onUnmounted(() => {

                    })
                }

            }
        }
    }

    export function FunctionDec() {
        return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
            const original = descriptor.value.bind(target)
            descriptor.value = () => {
                original()

            }
        }
    }

    export interface IHeaderBarOptionItem {
        type: string,
        icon: string,
        label: string
    }

    export enum RendererEvent {
        Message = 'Message',
        SecondInstance = 'SecondInstance',
    }

    export type RendererSendMessage = {
        event: RendererEvent,
        send: string
    }

    export type RendererEventCallback = (e: RendererSendMessage) => void
}
export { DR }
