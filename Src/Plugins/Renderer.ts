import { getName } from '@tauri-apps/api/app';
import { Manager } from '@/Libs/Manager';
import { TEvent } from '@/Decorators/TEvent';
import * as Tauri from '@tauri-apps/api';
import * as A from '@tauri-apps/plugin-autostart';
import * as C from '@tauri-apps/plugin-clipboard-manager';
import * as D from '@tauri-apps/plugin-dialog';
import * as F from '@tauri-apps/plugin-fs';
import * as P from '@tauri-apps/plugin-process';
import * as S from '@tauri-apps/plugin-shell';
import * as G from '@tauri-apps/plugin-global-shortcut';

@TEvent.Create(['Message', 'WidgetCreate', 'WidgetDestroy', 'CloseRequested', 'WidgetEmpty', 'FileDrop', 'ThemeUpdate', 'UpdateAutoStart', 'SecondInstance'])
class Renderer extends Manager {
    private flashTimer = 0;

    private port = -1;

    private tray!: Tauri.tray.TrayIcon;

    private autostartMenu!: Tauri.menu.CheckMenuItem;

    public get App() {
        return {
            GetName: () => {
                return getName();
            },
            IsAutostart: () => {
                return A.isEnabled();
            },
            UpdateAutostartFlag: (flag: boolean) => {
                return this.autostartMenu.setChecked(flag);
            },
            SetAutostart: async (b: boolean) => {
                const current = await this.App.IsAutostart();
                if (current && !b) {
                    await A.disable();
                    return this.App.UpdateAutostartFlag(false);
                } else if (!current && b) {
                    await A.enable();
                    return this.App.UpdateAutostartFlag(true);
                }
            },
            Close: () => {
                return P.exit(0);
            },
            Relaunch: () => {
                return P.relaunch();
            },
            Invoke: (cmd: string, args?: Tauri.core.InvokeArgs) => {
                return Tauri.core.invoke(cmd, args);
            },
            GetAllWidgets: () => {
                return Tauri.window.Window.getAll();
            },
            GetWidgetByLabel: (label: string) => {
                return Tauri.window.Window.getByLabel(label);
            },
            CreateWidget: async (label: string, options?: Tauri.webview.WebviewOptions) => {
                const exist = await this.App.GetWidgetByLabel(label);
                if (exist) {
                    await exist.show();
                    await exist.setFocus();
                    return exist;
                } else {
                    const widget = new Tauri.webviewWindow.WebviewWindow(label, options).window;
                    widget.once(Tauri.event.TauriEvent.WINDOW_CREATED, (e) => {
                        Tauri.event.emit(this.Event.TauriEvent.TAURI, {
                            event: this.RendererEvent.WidgetCreate,
                            extra: { windowLabel: label }
                        });
                    });
                    widget.once(Tauri.event.TauriEvent.WINDOW_DESTROYED, (e) => {
                        Tauri.event.emit(this.Event.TauriEvent.TAURI, {
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
                return Tauri.window.Window.getCurrent().minimize();
            },
            Max: async () => {
                if (await Tauri.window.Window.getCurrent().isFullscreen()) {
                    Tauri.window.Window.getCurrent().setFullscreen(false);
                    return Tauri.window.Window.getCurrent().setResizable(true);
                } else {
                    Tauri.window.Window.getCurrent().setFullscreen(true);
                    return Tauri.window.Window.getCurrent().setResizable(false);
                }
            },
            Hide: () => {
                return Tauri.window.Window.getCurrent().hide();
            },
            Close: () => {
                return Tauri.window.Window.getCurrent().close();
            },
            Show: async () => {
                await Tauri.window.Window.getCurrent().show();
                return Tauri.window.Window.getCurrent().setFocus();
            },
            Center: () => {
                return Tauri.window.Window.getCurrent().center();
            },
            SetAlwaysOnTop: (b: boolean) => {
                return Tauri.window.Window.getCurrent().setAlwaysOnTop(b);
            },
            SetSize: (w: number, h: number) => {
                return Tauri.window.Window.getCurrent().setSize(new Tauri.window.LogicalSize(w, h));
            },
            GetSize: () => {
                return Tauri.window.Window.getCurrent().innerSize();
            },
            SetPosition: (x: number, y: number) => {
                return Tauri.window.Window.getCurrent().setPosition(new Tauri.window.LogicalPosition(x, y));
            },
            GetPosition: () => {
                return Tauri.window.Window.getCurrent().innerPosition();
            },
            SetShadow: (enable: boolean) => {
                return Tauri.window.Window.getCurrent().setShadow(enable);
            },
            SetIgnoreCursorEvents: (ignore: boolean) => {
                return Tauri.window.Window.getCurrent().setIgnoreCursorEvents(ignore);
            },
            SetFullscreen: (b: boolean) => {
                return Tauri.window.Window.getCurrent().setFullscreen(b);
            },
            GetFullscreen: () => {
                return Tauri.window.Window.getCurrent().isFullscreen();
            },
            SetResizable: (b: boolean) => {
                return Tauri.window.Window.getCurrent().setResizable(b);
            },
            Listen: Tauri.window.Window.getCurrent().listen.bind(Tauri.window.Window.getCurrent())
        };
    }

    public get Resource() {
        return {
            /**
             * 通过名称获取文件路径 ( 仅限 Extra 文件夹 ) 例如: Images/icon.ico ( convert 是否转换成 Webview 可使用的格式 默认 true)
             */
            GetPathByName: async (name: string, convert: boolean = true) => {
                const base = (await Tauri.path.join(await Tauri.path.resourceDir(), '/Extra/', name)).replace('\\\\?\\', '').replaceAll('\\', '/').replaceAll('//', '/');
                const path = convert ? Tauri.core.convertFileSrc(base) : base;
                return path;
            },
            /**
             * 将真实文件地址转换为 Webview 可使用的地址
             */
            ConvertFileSrcToTauri: (path: string) => {
                return Tauri.core.convertFileSrc(path);
            },
            GetDesktopDir: () => {
                return Tauri.path.desktopDir();
            },
            GetSelectResources: async (options: Record<string, unknown> = {}) => {
                return D.open({
                    title: (options.title as string) || undefined,
                    multiple: (options.multiple as boolean) || false,
                    defaultPath: (options.defaultPath as string) || (await Tauri.path.resourceDir()),
                    directory: (options.directory as boolean) || false,
                    filters: (options.filters as Array<D.DialogFilter>) || undefined
                });
            },
            GetSaveResources: async (options: Record<string, unknown>) => {
                return D.save({
                    title: (options.title as string) || undefined,
                    defaultPath: (options.defaultPath as string) || (await Tauri.path.resourceDir()),
                    filters: (options.filters as Array<D.DialogFilter>) || undefined
                });
            },
            GetLocalServerProt: async () => {
                if (this.port === -1) {
                    return Tauri.core.invoke('GetLocalServerProt');
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
                return this.tray.setIcon(await Tauri.image.Image.fromPath(await this.Resource.GetPathByName(icon, false)));
            },
            SetTrayTooltip: (tooltip: string) => {
                return this.tray.setTooltip(tooltip);
            },
            Flash: async (icon: string) => {
                let show = true;
                this.flashTimer = setInterval(async () => {
                    if (show) {
                        this.tray.setVisible(false);
                    } else {
                        this.tray.setVisible(true);
                    }
                    show = !show;
                }, 700);
            },
            StopFlash: async (icon: string) => {
                if (this.flashTimer) {
                    clearInterval(this.flashTimer);
                }
                return this.Tray.SetTrayIcon(icon);
            }
        };
    }

    public get Event() {
        return {
            Listen: Tauri.event.listen,
            Once: Tauri.event.once,
            Emit: Tauri.event.emit,
            TauriEvent: {
                ...Tauri.event.TauriEvent,
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
        await this.CreateTray();
        this.ListenEvents();
        await this.Limit();
    }

    private async CreateTray() {
        this.autostartMenu = await Tauri.menu.CheckMenuItem.new({
            id: 'autostart',
            text: '开机自启',
            action: async () => {
                const isAutoStart = await this.App.IsAutostart();
                this.App.SetAutostart(!isAutoStart);
            }
        });
        this.tray = await Tauri.tray.TrayIcon.new({
            tooltip: '去码头整点薯条',
            icon: await Tauri.image.Image.fromPath(await this.Resource.GetPathByName('Images/tray.ico', false)),
            iconAsTemplate: true,
            menu: await Tauri.menu.Menu.new({
                items: [
                    this.autostartMenu,
                    await Tauri.menu.PredefinedMenuItem.new({ item: 'Separator' }),
                    await Tauri.menu.CheckMenuItem.new({
                        id: 'quit',
                        text: '退出',
                        action: async () => {
                            await this.App.Close();
                        }
                    })
                ]
            })
        });
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
        Tauri.window.Window.getCurrent().onCloseRequested((e) => {
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
}

const RendererInstance = new Renderer();

export { RendererInstance as Renderer };
