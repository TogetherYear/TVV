use tauri::App;

use super::Serve;

pub fn Init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    Serve::CreateServe(app);
    Ok(())
}

#[derive(Clone, serde::Serialize)]
pub struct TauriSendRendererPayload {
    pub event: String,
    pub send: String,
    pub extra: serde_json::Value,
}
