import { invoke, process } from '@tauri-apps/api'
import { appWindow } from "@tauri-apps/api/window"
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { resourceDir, join } from "@tauri-apps/api/path";

function Tauri() {
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
    })
}

function Renderer() {
    const Renderer = {
        App: {
            Close: () => {
                return process.exit(0)
            },
            Invoke: (cmd: string, args?: Record<string, unknown>) => {
                return invoke(cmd, args)
            }
        },
        Widget: {
            Min: () => {
                return appWindow.minimize()
            },
            Max: async () => {
                if (await appWindow.isFullscreen()) {
                    await appWindow.setFullscreen(false)
                    return appWindow.setResizable(true)
                }
                else {
                    await appWindow.setFullscreen(true)
                    return appWindow.setResizable(false)
                }
            },
            Hide: () => {
                return appWindow.hide()
            },
            Show: async () => {
                await appWindow.show()
                return appWindow.setFocus()
            },
            Listen: appWindow.listen.bind(appWindow)
        },
        Resource: {
            GetPathByName: async (name: string) => {
                const base = await join(await resourceDir(), '\\Need\\', name.replaceAll('/', '\\'))
                const path = convertFileSrc(base)
                return path
            }
        }
    }

    window.Renderer = Renderer
}

export { Tauri, Renderer }