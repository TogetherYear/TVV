use serde_json::json;
use tauri::{
    command,
    image::Image,
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager,
};

use super::TauriSendRendererPayload;

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
        .on_tray_icon_event(OnTrayEvent)
        .build(app)
        .unwrap();
}

fn OnTrayEvent(tray: &TrayIcon, event: TrayIconEvent) {
    match event {
        TrayIconEvent::DoubleClick {
            id: _,
            position: _,
            rect: _,
            button,
        } => {
            if button == MouseButton::Left {
                let window = tray.app_handle().get_webview_window("Application").unwrap();
                if window.is_minimized().unwrap() {
                    window.unminimize().unwrap();
                } else {
                    window.show().unwrap();
                }
                window.set_focus().unwrap();
            }
        }
        TrayIconEvent::Click {
            id: _,
            position,
            rect: _,
            button,
            button_state,
        } => {
            if button == MouseButton::Right && button_state == MouseButtonState::Up {
                tray.app_handle()
                    .emit_to(
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
        }
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
