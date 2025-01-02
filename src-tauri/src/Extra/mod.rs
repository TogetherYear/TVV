pub mod Serve;
pub mod Setup;
pub mod Tray;

#[derive(Clone, serde::Serialize)]
pub struct TauriSendRendererPayload {
    pub event: String,
    pub extra: serde_json::Value,
}
