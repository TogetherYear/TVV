use port_check::is_local_ipv4_port_free;
use reqwest::Client;
use tauri::{App, Manager};

use super::Serve::{self, PORT};

pub fn Init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    Serve::CreateLocalServer(app.app_handle());
    Ok(())
}

pub fn IsExistApp() -> bool {
    !is_local_ipv4_port_free(PORT)
}

pub async fn FocusFirstApp() {
    let client = Client::new();
    let url = format!("http://localhost:{}/secondinstance", PORT);
    let _ = client.get(&url).send().await;
}
