use port_check::is_local_ipv4_port_free;
use tauri::App;

use super::{
    Serve::{self, PORT},
    Tray::CreateTray,
};

pub fn Init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    CreateTray(app.handle());
    Serve::CreateLocalServer(app.handle());
    Ok(())
}

pub fn IsExistApp() -> bool {
    !is_local_ipv4_port_free(PORT)
}

pub async fn FocusFirstApp() {
    let client = tauri_plugin_http::reqwest::ClientBuilder::new()
        .build()
        .unwrap();
    let _ = client
        .get(format!("http://localhost:{}/SecondInstance", PORT))
        .send()
        .await;
}
