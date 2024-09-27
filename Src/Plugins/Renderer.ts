import * as A from 'tauri-plugin-autostart-api';
import * as C from '@tauri-apps/api/clipboard';
import * as D from '@tauri-apps/api/dialog';
import * as E from '@tauri-apps/api/event';
import * as F from '@tauri-apps/api/fs';
import * as G from '@tauri-apps/api/globalShortcut';
import * as Pa from '@tauri-apps/api/path';
import * as Pr from '@tauri-apps/api/process';
import * as Sh from '@tauri-apps/api/shell';
import * as T from '@tauri-apps/api/tauri';
import * as W from '@tauri-apps/api/window';
import { Manager } from '@/Libs/Manager';
import { TEvent } from '@/Decorators/TEvent';

@TEvent.Create(['Message', 'WidgetCreate', 'WidgetDestroy', 'CloseRequested', 'WidgetEmpty', 'FileDrop', 'ThemeUpdate', 'UpdateAutoStart', 'SecondInstance'])
class Renderer extends Manager {
    private flashTimer = 0;

    private port = -1;

    public get App() {
        return {
            IsAutostart: () => {
                return A.isEnabled();
            },
            UpdateAutostartFlag: (flag: boolean) => {
                return T.invoke('UpdateAutostartFlag', { flag });
            },
            SetAutostart: async (b: boolean) => {
                const current = await this.App.IsAutostart();
                console.log(current);
                if (current && !b) {
                    await A.disable();
                    return this.App.UpdateAutostartFlag(false);
                } else if (!current && b) {
                    await A.enable();
                    return this.App.UpdateAutostartFlag(true);
                }
            },
            Close: () => {
                return Pr.exit(0);
            },
            Relaunch: () => {
                return Pr.relaunch();
            },
            Invoke: (cmd: string, args?: T.InvokeArgs) => {
                return T.invoke(cmd, args);
            },
            GetAllWidgets: () => {
                return W.getAll();
            },
            GetWidgetByLabel: (label: string) => {
                const ws = this.App.GetAllWidgets();
                return ws.find((w) => w.label === label);
            },
            CreateWidget: async (label: string, options?: W.WindowOptions) => {
                const exist = this.App.GetWidgetByLabel(label);
                if (exist) {
                    await exist.show();
                    await exist.setFocus();
                    return exist;
                } else {
                    const widget = new W.WebviewWindow(label, options);
                    widget.once(E.TauriEvent.WINDOW_CREATED, (e) => {
                        E.emit(this.Event.TauriEvent.TAURI, {
                            event: this.RendererEvent.WidgetCreate,
                            extra: { windowLabel: label }
                        });
                    });
                    widget.once(E.TauriEvent.WINDOW_DESTROYED, (e) => {
                        E.emit(this.Event.TauriEvent.TAURI, {
                            event: this.RendererEvent.WidgetDestroy,
                            extra: { windowLabel: label }
                        });
                    });
                    return widget;
                }
            }
        };
    }

    public get Dialog() {
        return {
            Message: (message: string, options?: string | D.MessageDialogOptions) => {
                return D.message(message, options);
            },
            Ask: (message: string, options?: string | D.ConfirmDialogOptions) => {
                return D.ask(message, options);
            },
            Confirm: (message: string, options?: string | D.ConfirmDialogOptions) => {
                return D.confirm(message, options);
            }
        };
    }

    public get Clipboard() {
        return {
            WriteText: (text: string) => {
                return C.writeText(text);
            },
            ReadText: () => {
                return C.readText();
            }
        };
    }

    public get Widget() {
        return {
            Min: () => {
                return W.appWindow.minimize();
            },
            Max: async () => {
                if (await W.appWindow.isFullscreen()) {
                    W.appWindow.setFullscreen(false);
                    return W.appWindow.setResizable(true);
                } else {
                    W.appWindow.setFullscreen(true);
                    return W.appWindow.setResizable(false);
                }
            },
            Hide: () => {
                return W.appWindow.hide();
            },
            Close: () => {
                return W.appWindow.close();
            },
            Show: async () => {
                await W.appWindow.show();
                return W.appWindow.setFocus();
            },
            Center: () => {
                return W.appWindow.center();
            },
            SetAlwaysOnTop: (b: boolean) => {
                return W.appWindow.setAlwaysOnTop(b);
            },
            SetSize: (w: number, h: number) => {
                return W.appWindow.setSize(new W.LogicalSize(w, h));
            },
            GetSize: () => {
                return W.appWindow.innerSize();
            },
            SetPosition: (x: number, y: number) => {
                return W.appWindow.setPosition(new W.LogicalPosition(x, y));
            },
            GetPosition: () => {
                return W.appWindow.innerPosition();
            },
            SetShadow: (enable: boolean) => {
                return T.invoke('SetShadow', { enable });
            },
            SetIgnoreCursorEvents: (ignore: boolean) => {
                return W.appWindow.setIgnoreCursorEvents(ignore);
            },
            SetFullscreen: (b: boolean) => {
                return W.appWindow.setFullscreen(b);
            },
            GetFullscreen: () => {
                return W.appWindow.isFullscreen();
            },
            SetResizable: (b: boolean) => {
                return W.appWindow.setResizable(b);
            },
            Listen: W.appWindow.listen.bind(W.appWindow)
        };
    }

    public get Resource() {
        return {
            /**
             * 通过名称获取文件路径 ( 仅限 Extra 文件夹 ) 例如: Images/icon.ico ( convert 是否转换成 Webview 可使用的格式 默认 true)
             */
            GetPathByName: async (name: string, convert: boolean = true) => {
                const base = (await Pa.join(await Pa.resourceDir(), '/Extra/', name)).replace('\\\\?\\', '').replaceAll('\\', '/').replaceAll('//', '/');
                const path = convert ? T.convertFileSrc(base) : base;
                return path;
            },
            /**
             * 将真实文件地址转换为 Webview 可使用的地址
             */
            ConvertFileSrcToTauri: (path: string) => {
                return T.convertFileSrc(path);
            },
            GetDesktopDir: () => {
                return Pa.desktopDir();
            },
            GetSelectResources: async (options: Record<string, unknown> = {}) => {
                return D.open({
                    title: (options.title as string) || undefined,
                    multiple: (options.multiple as boolean) || false,
                    defaultPath: (options.defaultPath as string) || (await Pa.resourceDir()),
                    directory: (options.directory as boolean) || false,
                    filters: (options.filters as Array<D.DialogFilter>) || undefined
                });
            },
            GetSaveResources: async (options: Record<string, unknown>) => {
                return D.save({
                    title: (options.title as string) || undefined,
                    defaultPath: (options.defaultPath as string) || (await Pa.resourceDir()),
                    filters: (options.filters as Array<D.DialogFilter>) || undefined
                });
            },
            GetLocalServerProt: async () => {
                if (this.port === -1) {
                    return T.invoke('GetLocalServerProt');
                } else {
                    return this.port;
                }
            },
            GetFileByNameFromLocalServer: async (name: string) => {
                return `http://localhost:${await this.Resource.GetLocalServerProt()}/Static/${name}`;
            },
            ReadStringFromFile: (path: string) => {
                return F.readTextFile(path);
            },
            WriteStringToFile: async (path: string, content: string) => {
                const file = path.split('/').slice(-1)[0];
                const dir = path.replace(file, '');
                await this.Resource.CreateDir(dir);
                return F.writeTextFile(path, content);
            },
            ReadBinaryFromFile: (path: string) => {
                return F.readBinaryFile(path);
            },
            WriteBinaryToFile: async (path: string, content: F.BinaryFileContents) => {
                const file = path.split('/').slice(-1)[0];
                const dir = path.replace(file, '');
                await this.Resource.CreateDir(dir);
                return F.writeBinaryFile(path, content);
            },
            OpenPathDefault: (path: string) => {
                return Sh.open(path);
            },
            IsPathExists: (path: string) => {
                return F.exists(path);
            },
            ReadDirFiles: (path: string) => {
                return F.readDir(path);
            },
            CreateDir: async (path: string) => {
                if (!(await this.Resource.IsPathExists(path))) {
                    return F.createDir(path);
                }
            },
            RemoveDir: async (path: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.removeDir(path);
                }
            },
            RemoveFile: async (path: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.removeFile(path);
                }
            },
            Rename: async (path: string, newPath: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.renameFile(path, newPath);
                }
            },
            CopyFile: async (path: string, newPath: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.copyFile(path, newPath);
                }
            }
        };
    }

    public get GlobalShortcut() {
        return {
            UnregisterAll: () => {
                return G.unregisterAll();
            },
            IsRegistered: (shortcut: string) => {
                return G.isRegistered(shortcut);
            },
            Register: async (shortcut: string, handler: G.ShortcutHandler) => {
                const current = await this.GlobalShortcut.IsRegistered(shortcut);
                if (current) {
                    return false;
                }
                await G.register(shortcut, handler);
                return true;
            },
            Unregister: (shortcut: string) => {
                return G.unregister(shortcut);
            }
        };
    }

    public get Tray() {
        return {
            SetTrayIcon: (icon: string) => {
                return T.invoke('SetTrayIcon', { icon });
            },
            SetTrayTooltip: (tooltip: string) => {
                return T.invoke('SetTrayTooltip', { tooltip });
            },
            Flash: async (icon: string) => {
                let show = true;
                const emptyIcon = await this.Resource.GetPathByName('Images/empty.ico', false);
                this.flashTimer = setInterval(() => {
                    if (show) {
                        T.invoke('SetTrayIcon', { icon: emptyIcon });
                    } else {
                        T.invoke('SetTrayIcon', { icon });
                    }
                    show = !show;
                }, 700);
            },
            StopFlash: (icon: string) => {
                if (this.flashTimer) {
                    clearInterval(this.flashTimer);
                }
                return T.invoke('SetTrayIcon', { icon });
            }
        };
    }

    public get Event() {
        return {
            Listen: E.listen,
            Once: E.once,
            Emit: E.emit,
            TauriEvent: {
                ...E.TauriEvent,
                TAURI: 'tauri://tauri'
            }
        };
    }

    public get RendererEvent() {
        return {
            Message: 'Message',
            WidgetCreate: 'WidgetCreate',
            WidgetDestroy: 'WidgetDestroy',
            CloseRequested: 'CloseRequested',
            WidgetEmpty: 'WidgetEmpty',
            FileDrop: 'FileDrop',
            ThemeUpdate: 'ThemeUpdate',
            UpdateAutoStart: 'UpdateAutoStart',
            SecondInstance: 'SecondInstance'
        };
    }

    public async Run() {
        this.ListenEvents();
        await this.Limit();
        await this.Process();
    }

    private ListenEvents() {
        this.Event.Listen<Record<string, unknown>>(this.Event.TauriEvent.TAURI, async (e) => {
            const r = e.payload;
            if (r.event === this.RendererEvent.WidgetCreate) {
                this.Emit(this.RendererEvent.WidgetCreate, r);
            } else if (r.event === this.RendererEvent.WidgetDestroy) {
                this.Emit(this.RendererEvent.WidgetDestroy, r);
            } else if (r.event === this.RendererEvent.WidgetEmpty) {
                this.Emit(this.RendererEvent.WidgetEmpty, r);
            } else if (r.event === this.RendererEvent.UpdateAutoStart) {
                const isAutoStart = await this.App.IsAutostart();
                this.App.SetAutostart(!isAutoStart);
                this.Emit(this.RendererEvent.UpdateAutoStart, { event: this.RendererEvent.UpdateAutoStart, extra: { flag: !isAutoStart } });
            } else if (r.event === this.RendererEvent.SecondInstance) {
                this.Emit(this.RendererEvent.SecondInstance, { event: this.RendererEvent.SecondInstance, extra: {} });
            }
            this.Emit(this.RendererEvent.Message, r);
        });
        this.Event.Listen<Array<string>>(this.Event.TauriEvent.WINDOW_FILE_DROP, async (e) => {
            this.Emit(this.RendererEvent.FileDrop, {
                event: this.RendererEvent.FileDrop,
                extra: {
                    files: e.payload
                }
            });
        });
        this.Event.Listen<string>(this.Event.TauriEvent.WINDOW_THEME_CHANGED, (e) => {
            this.Emit(this.RendererEvent.ThemeUpdate, {
                event: this.RendererEvent.ThemeUpdate,
                extra: {
                    current: e.payload
                }
            });
        });
        W.appWindow.onCloseRequested((e) => {
            this.Emit(this.RendererEvent.CloseRequested, e as any);
        });
    }

    private async Limit() {
        const path = await this.Resource.GetPathByName(`Configs/${import.meta.env.PROD ? 'Production' : 'Development'}.json`, false);
        const json = JSON.parse(await this.Resource.ReadStringFromFile(path));
        if (!json.debug) {
            window.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        }
    }

    private async Process() {
        const dir = this.GetHrefDir();
        const p = await this.Resource.GetPathByName(`Scripts/${dir}`, false);
        if (await this.Resource.IsPathExists(p)) {
            const files = await this.Resource.ReadDirFiles(p);
            for (let f of files) {
                if (f.name?.indexOf('.js') != -1) {
                    let script = document.createElement('script');
                    script.type = 'module';
                    script.src = await this.Resource.GetPathByName(`Scripts/${dir}/${f.name}`);
                    document.body.appendChild(script);
                }
            }
        }
    }

    private GetHrefDir() {
        const href = location.href;
        if (href.indexOf('Application') != -1) {
            return 'Application';
        } else {
            return 'Application';
        }
    }
}

const RendererInstance = new Renderer();

export { RendererInstance as Renderer };
