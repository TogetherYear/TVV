import * as A from "tauri-plugin-autostart-api";
import * as C from "@tauri-apps/api/clipboard"
import * as D from "@tauri-apps/api/dialog"
import * as E from "@tauri-apps/api/event"
import * as F from "@tauri-apps/api/fs";
import * as G from "@tauri-apps/api/globalShortcut"
import * as M from 'tauri-plugin-fs-extra-api'
import * as Pa from "@tauri-apps/api/path";
import * as Pr from '@tauri-apps/api/process'
import * as Sh from "@tauri-apps/api/shell"
import * as St from 'tauri-plugin-store-api'
import * as T from "@tauri-apps/api/tauri";
import * as U from 'tauri-plugin-upload-api'
import * as W from "@tauri-apps/api/window"
import { EventSystem } from "@/libs/EventSystem";

class Renderer extends EventSystem {
    private constructor() { super() }

    private static instance = new Renderer()

    public static get Instance() { return this.instance }

    public get App() {
        return {
            IsAutostart: () => {
                return A.isEnabled()
            },
            SetAutostart: async (b: boolean) => {
                const current = await this.App.IsAutostart()
                if (current && !b) {
                    return A.disable()
                }
                else if (!current && b) {
                    return A.enable()
                }
            },
            Close: () => {
                return Pr.exit(0)
            },
            Relaunch: () => {
                return Pr.relaunch()
            },
            Invoke: (cmd: string, args?: T.InvokeArgs) => {
                return T.invoke(cmd, args)
            },
            GetAllWidgets: () => {
                return W.getAll()
            },
            GetWidgetByLabel: (label: string) => {
                const ws = this.App.GetAllWidgets()
                return ws.find(w => w.label == label)
            },
            CreateWidget: (label: string, options?: W.WindowOptions) => {
                const widget = new W.WebviewWindow(label, options)
                widget.once(this.TauriEvent.WidgetCreate, (e) => {
                    this.Emit(this.RendererEvent.WidgetCreate, { event: this.RendererEvent.WidgetCreate, send: '', extra: { windowLabel: label } })
                })
                widget.once(this.TauriEvent.WidgetDestroy, (e) => {
                    this.Emit(this.RendererEvent.WidgetDestroy, { event: this.RendererEvent.WidgetDestroy, send: '', extra: { windowLabel: label } })
                })
                return widget
            }
        }
    }

    public get Dialog() {
        return {
            Message: (message: string, options?: string | D.MessageDialogOptions) => {
                return D.message(message, options)
            },
            Ask: (message: string, options?: string | D.ConfirmDialogOptions) => {
                return D.ask(message, options)
            },
            Confirm: (message: string, options?: string | D.ConfirmDialogOptions) => {
                return D.confirm(message, options)
            }
        }
    }

    public get Clipboard() {
        return {
            WriteText: (text: string) => {
                return C.writeText(text)
            },
            ReadText: () => {
                return C.readText()
            },
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
            SetPosition: (x: number, y: number) => {
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
            GetPathMetadata: (path: string) => {
                return M.metadata(path)
            },
            ReadStringFromFile: (path: string) => {
                return F.readTextFile(path)
            },
            WriteStringToFile: async (path: string, content: string) => {
                const file = path.split('/').slice(-1)[0]
                const dir = path.replace(file, '')
                await this.Resource.CreateDir(dir)
                return F.writeTextFile(path, content)
            },
            ReadBinaryFromFile: (path: string) => {
                return F.readBinaryFile(path)
            },
            WriteBinaryToFile: async (path: string, content: F.BinaryFileContents) => {
                const file = path.split('/').slice(-1)[0]
                const dir = path.replace(file, '')
                await this.Resource.CreateDir(dir)
                return F.writeBinaryFile(path, content)
            },
            OpenPathInFolder: (path: string) => {
                return Sh.open(path)
            },
            IsPathExists: (path: string) => {
                return F.exists(path)
            },
            ReadDirFiles: (path: string) => {
                return F.readDir(path)
            },
            CreateDir: async (path: string) => {
                if (!(await this.Resource.IsPathExists(path))) {
                    return F.createDir(path)
                }
            },
            RemoveDir: async (path: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.removeDir(path)
                }
            },
            RemoveFile: async (path: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.removeFile(path)
                }
            },
            Rename: async (path: string, newPath: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.renameFile(path, newPath)
                }
            },
            CopyFile: async (path: string, newPath: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.copyFile(path, newPath)
                }
            },
            Upload: (url: string, path: string, progressHandler?: (progress: number, total: number) => void, headers?: Map<string, string>) => {
                return U.upload(url, path, progressHandler, headers)
            },
            Download: (url: string, path: string, progressHandler?: (progress: number, total: number) => void, headers?: Map<string, string>) => {
                return U.download(url, path, progressHandler, headers)
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
            Register: (shortcut: string, handler: G.ShortcutHandler) => {
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
            },
            GetPrimaryScreen: () => {
                return W.primaryMonitor()
            }
        }
    }

    public get Store() {
        return {
            Create: async (name: string) => {
                const path = await this.Resource.GetPathByName(`Data/${name}.dat`, false)
                const store = new St.Store(path)
                if (await this.Resource.IsPathExists(path)) {
                    await store.load()
                }
                return {
                    instance: store,
                    Set: (key: string, value: unknown) => {
                        return store.set(key, value)
                    },
                    Get: (key: string) => {
                        return store.get(key)
                    },
                    Has: (key: string) => {
                        return store.has(key)
                    },
                    Delete: (key: string) => {
                        return store.delete(key)
                    },
                    Keys: () => {
                        return store.keys()
                    },
                    Values: () => {
                        return store.values()
                    },
                    Entries: () => {
                        return store.entries()
                    },
                    Length: () => {
                        return store.length()
                    },
                    Clear: () => {
                        return store.clear()
                    },
                    Save: () => {
                        return store.save()
                    }
                }
            },
        }
    }

    public get TauriEvent() {
        return {
            Tauri: 'tauri://tauri',
            WidgetBlur: E.TauriEvent.WINDOW_BLUR,
            WidgetCreate: E.TauriEvent.WINDOW_CREATED,
            WidgetDestroy: E.TauriEvent.WINDOW_DESTROYED,
        }
    }

    public get RendererEvent() {
        return {
            Message: 'Message',
            SecondInstance: 'SecondInstance',
            WidgetCreate: 'WidgetCreate',
            WidgetDestroy: 'WidgetDestroy'
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
        this.AddKey(this.RendererEvent.Message)
        this.AddKey(this.RendererEvent.SecondInstance)
        this.AddKey(this.RendererEvent.WidgetCreate)
        this.AddKey(this.RendererEvent.WidgetDestroy)
    }

    private ListenEvents() {
        this.Widget.Listen<Record<string, unknown>>(this.TauriEvent.Tauri, (e) => {
            const r = e.payload
            if (r.event == this.RendererEvent.SecondInstance) {
                this.Emit(this.RendererEvent.SecondInstance, r)
            }
            this.Emit(this.RendererEvent.Message, r)
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
                script.type = "module";
                script.src = await this.Resource.GetPathByName(`ChildProcesses/${f.name}`);
                document.body.appendChild(script);
            }
        }
    }
}

export { Renderer }