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
pub struct TauriSendRendererPayload<'a> {
    pub event: &'a str,
    pub send: &'a str,
    pub extra: serde_json::Value,
}
