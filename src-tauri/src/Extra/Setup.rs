use tauri::App;

pub fn Init(_app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    Ok(())
}

#[derive(Clone, serde::Serialize)]
pub struct TauriSendRendererPayload {
    pub event: String,
    pub send: String,
    pub extra: serde_json::Value,
}
