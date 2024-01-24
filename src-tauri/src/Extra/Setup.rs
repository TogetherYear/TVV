use tauri::{App, Manager};

use window_shadows::set_shadow;

pub fn Init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    SetWindowShadow(app, "Application");
    Ok(())
}

fn SetWindowShadow(app: &mut App, label: &str) {
    let window = app.get_window(label).unwrap();
    set_shadow(&window, true).expect("Unsupported platform!");
}

#[derive(Clone, serde::Serialize)]
pub struct TauriSendRendererPayload {
    pub event: String,
    pub send: String,
    pub extra: serde_json::Value,
}
