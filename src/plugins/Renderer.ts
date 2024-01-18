import * as W from "@tauri-apps/api/window"
import * as T from "@tauri-apps/api/tauri";
import * as Pa from "@tauri-apps/api/path";
import * as Pr from '@tauri-apps/api/process'
import * as F from "@tauri-apps/api/fs";
import * as S from "@tauri-apps/api/shell"
import * as G from "@tauri-apps/api/globalShortcut"
import { EventSystem } from "@/libs/EventSystem";
import { DR } from "@/decorators/DR";

class Renderer extends EventSystem {
    private constructor() { super() }

    private static instance = new Renderer()

    public static get Instance() { return this.instance }

    public get App() {
        return {
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
                const widget = new W.WebviewWindow(label, options)
                widget.once('tauri://window-created', (e) => {
                    this.Emit(DR.RendererEvent.Create, { event: DR.RendererEvent.Create, send: '', extra: { windowLabel: label } })
                })
                widget.once('tauri://destroyed', (e) => {
                    this.Emit(DR.RendererEvent.Destroy, { event: DR.RendererEvent.Destroy, send: '', extra: { windowLabel: label } })
                })
                return widget
            }
        }
    }

    public get Widget() {
        return {
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
            Close: () => {
                return W.appWindow.close()
            },
            Show: async () => {
                await W.appWindow.show()
                return W.appWindow.setFocus()
            },
            Center: () => {
                return W.appWindow.center()
            },
            SetAlwaysOnTop: (b: boolean) => {
                return W.appWindow.setAlwaysOnTop(b)
            },
            SetSize: (w: number, h: number) => {
                return W.appWindow.setSize(new W.LogicalSize(w, h))
            },
            setPosition: (x: number, y: number) => {
                return W.appWindow.setPosition(new W.LogicalPosition(x, y))
            },
            Listen: W.appWindow.listen.bind(W.appWindow)
        }
    }

    public get Resource() {
        return {
            GetPathByName: async (name: string, convert: boolean = true) => {
                const base = (await Pa.join(await Pa.resourceDir(), 'Need/', name)).replace('\\\\?\\', '').replaceAll('\\', '/')
                const path = convert ? T.convertFileSrc(base) : base
                return path
            },
            ReadStringFromFile: (path: string) => {
                return F.readTextFile(path)
            },
            WriteStringToFile: async (path: string, content: string) => {
                const file = path.split('/').slice(-1)[0]
                const dir = path.replace(file, '')
                !(await F.exists(dir)) && (await F.createDir(dir))
                return F.writeTextFile(path, content)
            },
            ReadBinaryFromFile: (path: string) => {
                return F.readBinaryFile(path)
            },
            WriteBinaryToFile: async (path: string, content: F.BinaryFileContents) => {
                const file = path.split('/').slice(-1)[0]
                const dir = path.replace(file, '')
                !(await F.exists(dir)) && (await F.createDir(dir))
                return F.writeBinaryFile(path, content)
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
        }
    }

    public get GlobalShortcut() {
        return {
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
        }
    }

    public get Screen() {
        return {
            GetAllScreens: () => {
                return W.availableMonitors()
            },
            GetWidgetScreen: () => {
                return W.currentMonitor()
            }
        }
    }

    public async Run() {
        if (!window.Renderer) {
            //@ts-ignore
            window.Renderer = this
        }
        this.CreateEvents()
        this.ListenEvents()
        await this.Limit()
        await this.Process()
    }

    private CreateEvents() {
        this.AddKey(DR.RendererEvent.Message)
        this.AddKey(DR.RendererEvent.SecondInstance)
        this.AddKey(DR.RendererEvent.Create)
        this.AddKey(DR.RendererEvent.Destroy)
    }

    private ListenEvents() {
        W.appWindow.listen("Tauri", (e) => {
            const r = e.payload as DR.RendererSendMessage
            if (r.event == DR.RendererEvent.SecondInstance) {
                this.Emit(DR.RendererEvent.SecondInstance, r)
            }
            this.Emit(DR.RendererEvent.Message, r)
        })
    }

    private async Limit() {
        const path = await this.Resource.GetPathByName(`Configs/${import.meta.env.PROD ? 'Production' : 'Development'}.json`, false)
        const json = JSON.parse(await this.Resource.ReadStringFromFile(path))
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
            const files = await this.Resource.ReadDirFiles(await this.Resource.GetPathByName("ChildProcesses/", false))
            for (let f of files) {
                let script = document.createElement("script");
                script.type = "text/javascript";
                script.src = await this.Resource.GetPathByName(`ChildProcesses/${f.name}`);
                document.body.appendChild(script);
            }
        }
    }

    public override AddKey(key: DR.RendererEvent): void {
        super.AddKey(key)
    }

    public override Emit(key: DR.RendererEvent, data: DR.RendererSendMessage): void {
        super.Emit(key, data)
    }

    public override AddListen(key: DR.RendererEvent, scope: Object, callback: DR.RendererEventCallback, once?: boolean): void {
        super.AddListen(key, scope, callback, once)
    }

    public override RemoveListen(key: DR.RendererEvent, scope: Object, callback: DR.RendererEventCallback): void {
        super.RemoveListen(key, scope, callback)
    }
}

export { Renderer }