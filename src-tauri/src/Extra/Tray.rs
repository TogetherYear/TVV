use serde_json::json;
use tauri::{command, AppHandle, Icon, Manager, SystemTray, SystemTrayEvent};

use super::TauriSendRendererPayload;

pub fn Build() -> SystemTray {
    SystemTray::new().with_tooltip("去码头整点薯条")
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
        SystemTrayEvent::RightClick {
            tray_id: _,
            position,
            size: _,
            ..
        } => {
            app.emit_to(
                "Tray",
                "tauri://tauri",
                TauriSendRendererPayload {
                    event: String::from("PopupTray"),
                    extra: json!({
                        "x": position.x,
                        "y": position.y,
                    }),
                },
            )
            .unwrap();
        }
        _ => {}
    }
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
