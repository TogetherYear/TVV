use serde_json::json;
use tauri::{command, AppHandle, CustomMenuItem, Icon, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

use super::TauriSendRendererPayload;

pub fn Build() -> SystemTray {
    SystemTray::new().with_tooltip("去码头整点薯条")
    .with_menu(SystemTrayMenu::new()
    .add_item(CustomMenuItem::new("autostart", "开机自启"))
    .add_native_item(tauri::SystemTrayMenuItem::Separator)
    .add_item(CustomMenuItem::new("quit", "退出")))
}

pub fn OnEvent(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::DoubleClick {
            position: _,
            size: _,
            ..
        } => {
            let window = app.get_window("Application").unwrap();
            if window.is_minimized().unwrap() {
                window.unminimize().unwrap();
            } else {
                window.show().unwrap();
            }
            window.set_focus().unwrap();
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "autostart" => app
                .emit_to(
                    "Application",
                    "tauri://tauri",
                    TauriSendRendererPayload {
                        event: String::from("UpdateAutoStart"),
                        extra: json!({}),
                    },
                )
                .unwrap(),
            "quit" => app.exit(0),
            _ => {}
        },
        _ => {}
    }
}

#[command]
pub fn UpdateAutostartFlag(app_handle: tauri::AppHandle, flag: bool) {
    app_handle
        .tray_handle()
        .get_item("autostart")
        .set_selected(flag)
        .unwrap();
}

#[command]
pub fn SetTrayIcon(icon: String, app_handle: tauri::AppHandle) {
    app_handle
        .tray_handle()
        .set_icon(Icon::File(std::path::PathBuf::from(icon)))
        .unwrap();
}

#[command]
pub fn SetTrayTooltip(tooltip: String, app_handle: tauri::AppHandle) {
    app_handle
        .tray_handle()
        .set_tooltip(tooltip.as_str())
        .unwrap();
}
