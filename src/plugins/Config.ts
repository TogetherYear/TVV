import * as W from "@tauri-apps/api/window"
import * as T from "@tauri-apps/api/tauri";
import * as Pa from "@tauri-apps/api/path";
import * as Pr from '@tauri-apps/api/process'
import * as F from "@tauri-apps/api/fs";
import * as S from "@tauri-apps/api/shell"
import * as G from "@tauri-apps/api/globalShortcut"

class Config {
    private constructor() { }

    private static instance = new Config()

    public static get Instance() { return this.instance }

    public async Run() {
        this.Tauri()
        await this.Limit()
        await this.Process()
    }

    private Tauri() {
        const Renderer = {
            App: {
                Close: () => {
                    return Pr.exit(0)
                },
                Relaunch: () => {
                    return Pr.relaunch()
                },
                Invoke: (cmd: string, args?: T.InvokeArgs) => {
                    return T.invoke(cmd, args)
                },
                CreateWidget: (label: string, options?: W.WindowOptions) => {
                    const widget = new W.WebviewWindow(label, options) as unknown
                    return widget
                }
            },
            Widget: {
                Min: () => {
                    return W.appWindow.minimize()
                },
                Max: async () => {
                    if (await W.appWindow.isFullscreen()) {
                        await W.appWindow.setFullscreen(false)
                        return W.appWindow.setResizable(true)
                    }
                    else {
                        await W.appWindow.setFullscreen(true)
                        return W.appWindow.setResizable(false)
                    }
                },
                Hide: () => {
                    return W.appWindow.hide()
                },
                Show: async () => {
                    await W.appWindow.show()
                    return W.appWindow.setFocus()
                },
                Listen: W.appWindow.listen.bind(W.appWindow)
            },
            Resource: {
                GetPathByName: async (name: string, convert: boolean = true) => {
                    const base = (await Pa.join(await Pa.resourceDir(), 'Need/', name)).replace('\\\\?\\', '').replaceAll('\\', '/')
                    const path = convert ? T.convertFileSrc(base) : base
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
                    return S.open(path)
                },
                IsPathExists: (path: string) => {
                    return F.exists(path)
                },
                ReadDirFiles: (path: string) => {
                    return F.readDir(path)
                }
            },
            GlobalShortcut: {
                UnregisterAll: () => {
                    return G.unregisterAll()
                },
                IsRegistered: (shortcut: string) => {
                    return G.isRegistered(shortcut)
                },
                Register: (shortcut: string, handler: (shortcut: string) => {}) => {
                    return G.register(shortcut, handler)
                },
                Unregister: (shortcut: string) => {
                    return G.unregister(shortcut)
                },
            },
            Screen: {
                GetAllScreens: () => {
                    return W.availableMonitors()
                },
                GetWidgetScreen: () => {
                    return W.currentMonitor()
                }
            }
        }

        window.Renderer = Renderer
    }

    private async Limit() {
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

    private async Process() {
        if (location.href.split('/').slice(-1)[0] == "Application") {
            const files = await Renderer.Resource.ReadDirFiles(await Renderer.Resource.GetPathByName("ChildProcesses/", false))
            for (let f of files) {
                let script = document.createElement("script");
                script.type = "text/javascript";
                script.src = await Renderer.Resource.GetPathByName(`ChildProcesses/${f.name}`);
                document.body.appendChild(script);
            }
        }
    }
}

export { Config }