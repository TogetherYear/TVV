use tauri::{command, GlobalWindowEvent};

use window_shadows::set_shadow;

pub fn OnWindowEvent(e: GlobalWindowEvent) {
    match e.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            if e.window().label() == "Application" {
                api.prevent_close();
                e.window().hide().unwrap();
            }
        }
        _ => {}
    }
}

#[command]
pub fn SetWindowShadow(window: tauri::Window, enable: bool) {
    set_shadow(&window, enable).unwrap();
}
