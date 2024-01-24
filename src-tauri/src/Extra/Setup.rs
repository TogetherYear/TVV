use tauri::{App, Manager};

use window_shadows::set_shadow;

pub fn Init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    SetWindowShadow(app);
    Ok(())
}

fn SetWindowShadow(app: &mut App) {
    let window = app.get_window("Application").unwrap();
    set_shadow(&window, true).expect("Unsupported platform!");
}

#[derive(Clone, serde::Serialize)]
pub struct TauriSendRendererPayload<'a> {
    pub(crate) event: &'a str,
    pub(crate) send: &'a str,
    pub(crate) extra: serde_json::Value,
}
