use tauri::{
    command,
    image::Image,
    menu::{CheckMenuItem, Menu, MenuEvent, MenuItem, PredefinedMenuItem},
    tray::{TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Wry,
};
use tauri_plugin_autostart::AutoLaunchManager;

pub fn CreateTray(app: &AppHandle) {
    let icon = format!(
        "{}{}",
        app.path()
            .resource_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .replace("\\\\?\\", "")
            .replace("//", "/")
            .replace("\\", "/"),
        "/Extra/Images/tray.ico"
    );

    let _ = TrayIconBuilder::with_id("Tray")
        .tooltip("去码头整点薯条")
        .icon(Image::from_path(icon).unwrap())
        .menu(&CreateMenu(app))
        .on_tray_icon_event(OnTrayEvent)
        .on_menu_event(OnMenuClick)
        .build(app)
        .unwrap();
}

fn CreateMenu(app: &AppHandle) -> Menu<Wry> {
    let autostart = &CheckMenuItem::with_id(
        app,
        "autostart",
        "开机自启",
        true,
        app.state::<AutoLaunchManager>().is_enabled().unwrap(),
        None::<&str>,
    )
    .unwrap();

    let separator = &PredefinedMenuItem::separator(app).unwrap();

    let quit = &MenuItem::with_id(app, "quit", "退出", true, None::<&str>).unwrap();

    let menu = tauri::menu::MenuBuilder::new(app)
        .items(&[autostart, separator, quit])
        .build()
        .unwrap();
    menu
}

fn OnTrayEvent(tray: &TrayIcon, event: TrayIconEvent) {
    match event {
        TrayIconEvent::DoubleClick { .. } => {
            let window = tray.app_handle().get_webview_window("Application").unwrap();
            if window.is_minimized().unwrap() {
                window.unminimize().unwrap();
            } else {
                window.show().unwrap();
            }
            window.set_focus().unwrap();
        }
        _ => {}
    }
}

fn OnMenuClick(app: &AppHandle, event: MenuEvent) {
    match event.id.as_ref() {
        "autostart" => {
            let at = app.state::<AutoLaunchManager>();
            if at.is_enabled().unwrap() {
                at.disable().unwrap();
            } else {
                at.enable().unwrap();
            }
            UpdateMenu(app.clone());
        }
        "quit" => app.exit(0),
        _ => {}
    }
}

#[command]
pub fn SetTrayIcon(icon: String, app_handle: AppHandle) {
    app_handle
        .tray_by_id("Tray")
        .unwrap()
        .set_icon(Some(Image::from_path(icon).unwrap()))
        .unwrap();
}

#[command]
pub fn SetTrayTooltip(tooltip: String, app_handle: AppHandle) {
    app_handle
        .tray_by_id("Tray")
        .unwrap()
        .set_tooltip(Some(tooltip.as_str()))
        .unwrap();
}

#[command]
pub fn UpdateMenu(app_handle: AppHandle) {
    app_handle
        .tray_by_id("Tray")
        .unwrap()
        .set_menu(Some(CreateMenu(&app_handle)))
        .unwrap();
}
