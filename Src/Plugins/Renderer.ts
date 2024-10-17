import { getName } from '@tauri-apps/api/app';
import { Manager } from '@/Libs/Manager';
import { TEvent } from '@/Decorators/TEvent';
import * as A from '@tauri-apps/plugin-autostart';
import * as C from '@tauri-apps/plugin-clipboard-manager';
import * as D from '@tauri-apps/plugin-dialog';
import * as F from '@tauri-apps/plugin-fs';
import * as G from '@tauri-apps/plugin-global-shortcut';
import * as P from '@tauri-apps/plugin-process';
import * as S from '@tauri-apps/plugin-shell';
import * as T from '@tauri-apps/api';

@TEvent.Create(['Message', 'WidgetCreate', 'WidgetDestroy', 'CloseRequested', 'WidgetEmpty', 'FileDrop', 'ThemeUpdate', 'SecondInstance', 'PopupTray', 'Show', 'Blur'])
class Renderer extends Manager {
    private flashTimer = 0;

    private port = -1;

    public get App() {
        return {
            GetName: () => {
                return getName();
            },
            IsAutostart: () => {
                return A.isEnabled();
            },
            SetAutostart: async (flag: boolean) => {
                if (flag) {
                    return A.enable();
                } else {
                    return A.disable();
                }
            },
            Close: () => {
                return P.exit(0);
            },
            Relaunch: () => {
                return P.relaunch();
            },
            Invoke: (cmd: string, args?: T.core.InvokeArgs) => {
                return T.core.invoke(cmd, args);
            },
            GetAllWidgets: () => {
                return T.window.Window.getAll();
            },
            GetWidgetByLabel: (label: string) => {
                return T.window.Window.getByLabel(label);
            },
            CreateWidget: async (label: string, options?: Omit<T.webview.WebviewOptions, 'x' | 'y' | 'width' | 'height'> & T.window.WindowOptions) => {
                const exist = await this.App.GetWidgetByLabel(label);
                if (exist) {
                    await exist.show();
                    await exist.setFocus();
                    return exist;
                } else {
                    const widget = new T.webviewWindow.WebviewWindow(label, options);
                    widget.once(T.event.TauriEvent.WINDOW_CREATED, (e) => {
                        T.event.emit(this.Event.TauriEvent.TAURI, {
                            event: this.RendererEvent.WidgetCreate,
                            extra: { windowLabel: label }
                        });
                    });
                    widget.once(T.event.TauriEvent.WINDOW_DESTROYED, (e) => {
                        T.event.emit(this.Event.TauriEvent.TAURI, {
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
                return T.window.Window.getCurrent().minimize();
            },
            Max: async () => {
                if (await T.window.Window.getCurrent().isFullscreen()) {
                    T.window.Window.getCurrent().setFullscreen(false);
                    return T.window.Window.getCurrent().setResizable(true);
                } else {
                    T.window.Window.getCurrent().setFullscreen(true);
                    return T.window.Window.getCurrent().setResizable(false);
                }
            },
            Hide: () => {
                return T.window.Window.getCurrent().hide();
            },
            Close: () => {
                return T.window.Window.getCurrent().close();
            },
            Show: async () => {
                await T.window.Window.getCurrent().show();
                return T.window.Window.getCurrent().setFocus();
            },
            Center: () => {
                return T.window.Window.getCurrent().center();
            },
            SetAlwaysOnTop: (b: boolean) => {
                return T.window.Window.getCurrent().setAlwaysOnTop(b);
            },
            SetSize: (w: number, h: number) => {
                return T.window.Window.getCurrent().setSize(new T.window.LogicalSize(w, h));
            },
            GetSize: () => {
                return T.window.Window.getCurrent().innerSize();
            },
            SetPosition: (x: number, y: number) => {
                return T.window.Window.getCurrent().setPosition(new T.window.LogicalPosition(x, y));
            },
            GetPosition: () => {
                return T.window.Window.getCurrent().innerPosition();
            },
            SetShadow: (enable: boolean) => {
                return T.window.Window.getCurrent().setShadow(enable);
            },
            SetIgnoreCursorEvents: (ignore: boolean) => {
                return T.window.Window.getCurrent().setIgnoreCursorEvents(ignore);
            },
            SetFullscreen: (b: boolean) => {
                return T.window.Window.getCurrent().setFullscreen(b);
            },
            IsFullscreen: () => {
                return T.window.Window.getCurrent().isFullscreen();
            },
            IsMinimized: () => {
                return T.window.Window.getCurrent().isMinimized();
            },
            UnMinimized: () => {
                return T.window.Window.getCurrent().unminimize();
            },
            SetResizable: (b: boolean) => {
                return T.window.Window.getCurrent().setResizable(b);
            },
            Listen: T.window.Window.getCurrent().listen.bind(T.window.Window.getCurrent())
        };
    }

    public get Resource() {
        return {
            /**
             * 通过名称获取文件路径 ( 仅限 Extra 文件夹 ) 例如: Images/icon.ico ( convert 是否转换成 Webview 可使用的格式 默认 true)
             */
            GetPathByName: async (name: string, convert: boolean = true) => {
                const base = (await T.path.join(await T.path.resourceDir(), '/Extra/', name)).replace('\\\\?\\', '').replaceAll('\\', '/').replaceAll('//', '/');
                const path = convert ? T.core.convertFileSrc(base) : base;
                return path;
            },
            /**
             * 将真实文件地址转换为 Webview 可使用的地址
             */
            ConvertFileSrcToTauri: (path: string) => {
                return T.core.convertFileSrc(path);
            },
            GetDesktopDir: () => {
                return T.path.desktopDir();
            },
            GetSelectResources: async (options: Record<string, unknown> = {}) => {
                return D.open({
                    title: (options.title as string) || undefined,
                    multiple: (options.multiple as boolean) || false,
                    defaultPath: (options.defaultPath as string) || (await T.path.resourceDir()),
                    directory: (options.directory as boolean) || false,
                    filters: (options.filters as Array<D.DialogFilter>) || undefined
                });
            },
            GetSaveResources: async (options: Record<string, unknown>) => {
                return D.save({
                    title: (options.title as string) || undefined,
                    defaultPath: (options.defaultPath as string) || (await T.path.resourceDir()),
                    filters: (options.filters as Array<D.DialogFilter>) || undefined
                });
            },
            GetLocalServerProt: async () => {
                if (this.port === -1) {
                    return T.core.invoke('GetLocalServerProt');
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
            OpenPathDefault: (path: string) => {
                return S.open(path);
            },
            IsPathExists: (path: string) => {
                return F.exists(path);
            },
            ReadDirFiles: (path: string) => {
                return F.readDir(path);
            },
            CreateDir: async (path: string) => {
                if (!(await this.Resource.IsPathExists(path))) {
                    return F.mkdir(path);
                }
            },
            Remove: async (path: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.remove(path);
                }
            },
            Rename: async (path: string, newPath: string) => {
                if (await this.Resource.IsPathExists(path)) {
                    return F.rename(path, newPath);
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
            SetTrayIcon: async (icon: string) => {
                return T.core.invoke('SetTrayIcon', { icon });
            },
            SetTrayTooltip: (tooltip: string) => {
                return T.core.invoke('SetTrayTooltip', { tooltip });
            },
            Flash: async (icon?: string) => {
                let show = true;
                const emptyIcon = await this.Resource.GetPathByName('Images/empty.ico', false);
                this.flashTimer = setInterval(async () => {
                    if (show) {
                        T.core.invoke('SetTrayIcon', { icon: emptyIcon });
                    } else {
                        T.core.invoke('SetTrayIcon', { icon: icon || (await this.Resource.GetPathByName('Images/tray.ico', false)) });
                    }
                    show = !show;
                }, 700);
            },
            StopFlash: async (icon?: string) => {
                if (this.flashTimer) {
                    clearInterval(this.flashTimer);
                }
                return T.core.invoke('SetTrayIcon', { icon: icon || (await this.Resource.GetPathByName('Images/tray.ico', false)) });
            }
        };
    }

    public get Event() {
        return {
            Listen: T.event.listen,
            Once: T.event.once,
            Emit: T.event.emit,
            TauriEvent: {
                ...T.event.TauriEvent,
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
            SecondInstance: 'SecondInstance',
            PopupTray: 'PopupTray',
            Show: 'Show',
            Blur: 'Blur'
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
            } else if (r.event === this.RendererEvent.SecondInstance) {
                this.Emit(this.RendererEvent.SecondInstance, { event: this.RendererEvent.SecondInstance, extra: {} });
            } else if (r.event === this.RendererEvent.PopupTray) {
                this.Emit(this.RendererEvent.PopupTray, r);
            }
            this.Emit(this.RendererEvent.Message, r);
        });
        this.Event.Listen<Array<string>>(this.Event.TauriEvent.DRAG_DROP, async (e) => {
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
        this.Event.Listen<string>(this.Event.TauriEvent.WINDOW_FOCUS, (e) => {
            this.Emit(this.RendererEvent.Show, {
                event: this.RendererEvent.Show,
                extra: {}
            });
        });
        this.Event.Listen<string>(this.Event.TauriEvent.WINDOW_BLUR, (e) => {
            this.Emit(this.RendererEvent.Blur, {
                event: this.RendererEvent.Blur,
                extra: {}
            });
        });
        T.window.Window.getCurrent().onCloseRequested((e) => {
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
