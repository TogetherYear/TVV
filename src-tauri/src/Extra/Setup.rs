use tauri::{App, GlobalWindowEvent};

pub fn Init(_app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    Ok(())
}

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

#[derive(Clone, serde::Serialize)]
pub struct TauriSendRendererPayload {
    pub event: String,
    pub send: String,
    pub extra: serde_json::Value,
}
