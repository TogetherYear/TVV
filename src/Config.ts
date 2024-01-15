import { invoke, process } from '@tauri-apps/api'
import { appWindow } from "@tauri-apps/api/window"
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { resourceDir, join } from "@tauri-apps/api/path";
import * as F from "@tauri-apps/api/fs";
import { shell } from "@tauri-apps/api"

const allow = ["Application"]

function Limit() {
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
            GetPathByName: async (name: string, convert: boolean = true) => {
                const base = (await join(await resourceDir(), 'Need/', name)).replace('\\\\?\\', '').replaceAll('\\', '/')
                const path = convert ? convertFileSrc(base) : base
                return path
            },
            ReadJsonFileToObject: async (path: string) => {
                const r = JSON.parse(await F.readTextFile(path))
                return r
            },
            WriteStringToFile: async (path: string, content: string) => {
                const file = path.split('/').slice(-1)[0]
                const dir = path.replace(file, '')
                !(await F.exists(dir)) && (await F.createDir(dir))
                return F.writeTextFile(path, content)
            },
            OpenPathInFolder: (path: string) => {
                return shell.open(path)
            },
            IsPathExists: (path: string) => {
                return F.exists(path)
            },
            ReadDirFiles: (path: string) => {
                return F.readDir(path)
            }
        }
    }

    window.Renderer = Renderer
}

async function Tauri() {
    const path = await Renderer.Resource.GetPathByName(`Configs/${import.meta.env.PROD ? 'Production' : 'Development'}.json`, false)
    const json = await Renderer.Resource.ReadJsonFileToObject(path)
    if (!json.debug) {
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
        })
    }

}

async function Process() {
    if (allow.indexOf(location.href.split('/').slice(-1)[0]) != -1) {
        const files = await Renderer.Resource.ReadDirFiles(await Renderer.Resource.GetPathByName("ChildProcesses/", false))
        for (let f of files) {
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.src = await Renderer.Resource.GetPathByName(`ChildProcesses/${f.name}`);
            document.body.appendChild(script);
        }
    }
}

export { Limit, Tauri, Process }