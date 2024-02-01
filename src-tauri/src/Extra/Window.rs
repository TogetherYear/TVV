use tauri::GlobalWindowEvent;

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
