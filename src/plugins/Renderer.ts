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
                widget.once(E.TauriEvent.WINDOW_CREATED, (e) => {
                    E.emit(this.Event.TauriEvent.TAURI, { event: this.RendererEvent.WidgetCreate, send: '', extra: { windowLabel: label } })
                })
                widget.once(E.TauriEvent.WINDOW_DESTROYED, (e) => {
                    E.emit(this.Event.TauriEvent.TAURI, { event: this.RendererEvent.WidgetDestroy, send: '', extra: { windowLabel: label } })
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

    public get Window() {
        return {
            GetAllWindows: async () => {
                return (await T.invoke("GetAllWindows") as Array<Record<string, unknown>>).map(w => this.Window.TransformWindow(w))
            },
            CaptureWindow: async (id: number) => {
                if (await T.invoke("CaptureWindow", { id, path: await this.CaptureTempInputPath })) {
                    return await this.CaptureTempOutputPath
                }
                return ""
            },
            TransformWindow: (window: Record<string, unknown>) => {
                return {
                    ...window,
                    Capture: async () => {
                        if (!window.isMinimized) {
                            return await this.Window.CaptureWindow(window.id as number)
                        }
                        return ""
                    }
                }
            }
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
            OpenPathDefault: (path: string) => {
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

    public get Monitor() {
        return {
            GetAllMonitors: async () => {
                return (await T.invoke("GetAllMonitors") as Array<Record<string, unknown>>).map(m => this.Monitor.TransformMonitor(m))
            },
            GetMonitorFromPoint: async (x: number, y: number) => {
                return this.Monitor.TransformMonitor(await T.invoke("GetMonitorFromPoint", { x, y }))
            },
            GetCurrentMouseMonitor: async () => {
                return this.Monitor.TransformMonitor(await T.invoke("GetCurrentMouseMonitor"))
            },
            GetPrimaryMonitor: async () => {
                return this.Monitor.TransformMonitor(await T.invoke("GetPrimaryMonitor"))
            },
            CaptureMonitor: async (id: number) => {
                if (await T.invoke("CaptureMonitor", { id, path: await this.CaptureTempInputPath })) {
                    return await this.CaptureTempOutputPath
                }
                return ""
            },
            TransformMonitor: (monitor: Record<string, unknown>) => {
                return {
                    ...monitor,
                    Capture: () => {
                        return this.Monitor.CaptureMonitor(monitor.id as number)
                    }
                }
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

    public get Automatic() {
        return {
            GetMousePosition: () => {
                return T.invoke("GetMousePosition")
            },
            SetMousePosition: (x: number, y: number) => {
                return T.invoke("SetMousePosition", { x, y })
            },
            SetButtonClick: (button: number, delay: number = 100) => {
                return T.invoke("SetButtonClick", { button, delay })
            },
            SetButtonToggle: (button: number, down: boolean) => {
                return T.invoke("SetButtonToggle", { button, down })
            },
            SetMouseScroll: (direction: number, clicks: number) => {
                return T.invoke("SetMouseScroll", { direction, clicks })
            },
            GetColorFromPosition: (x: number, y: number) => {
                return T.invoke("GetColorFromPosition", { x, y })
            },
            GetCurrentPositionColor: () => {
                return T.invoke("GetCurrentPositionColor")
            },
            WriteText: async (content: string, paste: boolean = false) => {
                await this.Clipboard.WriteText(content)
                return T.invoke("WriteText", { content, paste })
            },
            SetKeysToggle: (toggleKeys: Array<{ key: number, down: boolean }>) => {
                return T.invoke("SetKeysToggle", { json: JSON.stringify({ toggleKeys }) })
            },
            SetKeysClick: (keys: Array<number>) => {
                return T.invoke("SetKeysClick", { keys })
            }
        }
    }

    public get Extra() {
        return {
            Code: async (text: string) => {
                await this.Clipboard.WriteText(text)
                this.App.CreateWidget('Extra:Code', {
                    url: this.Extra.GetExtraUrl('Extra/Code'),
                    width: 310,
                    height: 336,
                    resizable: false,
                    maximizable: false,
                    decorations: false,
                    alwaysOnTop: true,
                    center: true,
                    transparent: true,
                    visible: false,
                    focus: false
                })
            },
            ImagePreview: async (url: string) => {
                await this.Clipboard.WriteText(url)
                this.App.CreateWidget('Extra:ImagePreview', {
                    url: this.Extra.GetExtraUrl('Extra/ImagePreview'),
                    width: 1060,
                    height: 560,
                    minWidth: 420,
                    minHeight: 260,
                    resizable: true,
                    maximizable: false,
                    decorations: false,
                    alwaysOnTop: true,
                    center: true,
                    transparent: true,
                    visible: false,
                    focus: false
                })
            },
            ModelPreview: (url: string) => {
                this.App.CreateWidget('Extra:ModelPreview', {
                    url: this.Extra.GetExtraUrl('Extra/ModelPreview'),
                    width: 1160,
                    height: 760,
                    minWidth: 420,
                    minHeight: 260,
                    resizable: true,
                    maximizable: false,
                    decorations: false,
                    alwaysOnTop: true,
                    center: true,
                    transparent: true,
                    visible: false,
                    focus: false
                })
            },
            GetExtraUrl: (route: string) => {
                return `${location.origin}/#/${route}`
            }
        }
    }

    public get Event() {
        return {
            Listen: E.listen,
            Once: E.once,
            Emit: E.emit,
            TauriEvent: {
                ...E.TauriEvent,
                TAURI: "tauri://tauri"
            }
        }
    }

    public get Key() {
        return {
            Num0: 0,
            Num1: 1,
            Num2: 2,
            Num3: 3,
            Num4: 4,
            Num5: 5,
            Num6: 6,
            Num7: 7,
            Num8: 8,
            Num9: 9,
            A: 10,
            B: 11,
            C: 12,
            D: 13,
            E: 14,
            F: 15,
            G: 16,
            H: 17,
            I: 18,
            J: 19,
            K: 20,
            L: 21,
            M: 22,
            N: 23,
            O: 24,
            P: 25,
            Q: 26,
            R: 27,
            S: 28,
            T: 29,
            U: 30,
            V: 31,
            W: 32,
            X: 33,
            Y: 34,
            Z: 35,
            Add: 36,
            Subtract: 37,
            Multiply: 38,
            Divide: 39,
            OEM2: 40,
            Tab: 41,
            CapsLock: 42,
            Shift: 43,
            Control: 44,
            Alt: 45,
            Space: 46,
            Backspace: 47,
            Return: 48,
            Escape: 49,
            UpArrow: 50,
            DownArrow: 51,
            LeftArrow: 52,
            RightArrow: 53,
        }
    }

    public get Button() {
        return {
            Left: 0,
            Middle: 1,
            Right: 2
        }
    }

    public get ScrollDirection() {
        return {
            Down: 0,
            Up: 1,
        }
    }

    public get RendererEvent() {
        return {
            Message: 'Message',
            SecondInstance: 'SecondInstance',
            WidgetCreate: 'WidgetCreate',
            WidgetDestroy: 'WidgetDestroy',
            WidgetEmpty: 'WidgetEmpty'
        }
    }

    public get CaptureTempInputPath() {
        return this.Resource.GetPathByName('Images/CaptureTemp.webp', false)
    }

    public get CaptureTempOutputPath() {
        return this.Resource.GetPathByName('Images/CaptureTemp.webp', true)
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
        this.AddKey(this.RendererEvent.WidgetEmpty)
    }

    private ListenEvents() {
        this.Event.Listen<Record<string, unknown>>(this.Event.TauriEvent.TAURI, (e) => {
            const r = e.payload
            if (r.event == this.RendererEvent.SecondInstance) {
                this.Emit(this.RendererEvent.SecondInstance, r)
            }
            else if (r.event == this.RendererEvent.WidgetCreate) {
                this.Emit(this.RendererEvent.WidgetCreate, r)
            }
            else if (r.event == this.RendererEvent.WidgetDestroy) {
                this.Emit(this.RendererEvent.WidgetDestroy, r)
            }
            else if (r.event == this.RendererEvent.WidgetEmpty) {
                this.Emit(this.RendererEvent.WidgetEmpty, r)
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
        const dir = location.href.indexOf("Extra") != -1 ? "Extra" : location.href.split('/').slice(-1)[0]
        const p = await this.Resource.GetPathByName(`ChildProcesses/${dir}`, false)
        if (await this.Resource.IsPathExists(p)) {
            const files = await this.Resource.ReadDirFiles(p)
            for (let f of files) {
                let script = document.createElement("script");
                script.type = "module";
                script.src = await this.Resource.GetPathByName(`ChildProcesses/${dir}/${f.name}`);
                document.body.appendChild(script);
            }
        }
    }
}

export { Renderer }