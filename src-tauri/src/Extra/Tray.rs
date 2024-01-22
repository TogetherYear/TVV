use tauri::{AppHandle, Manager, PhysicalPosition, SystemTray, SystemTrayEvent};

use super::Autopilot::GetMousePosition;

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
            position: _,
            size: _,
            ..
        } => {
            let window = app.get_window("Tray").unwrap();
            let point = GetMousePosition();
            let size = window.inner_size().unwrap();
            window
                .set_position(PhysicalPosition::new(
                    (point.x as u32) - size.width + 2,
                    (point.y as u32) - size.height + 2,
                ))
                .unwrap();
            window.set_always_on_top(true).unwrap();
            window.show().unwrap();
            window.set_focus().unwrap();
        }
        _ => {}
    }
}
