use port_check::is_local_ipv4_port_free;
use tauri::{App, Manager};

use super::{
    Link::RegisterDeepLink,
    Serve::{self, PORT},
    Tray::CreateTray,
};

pub fn Init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    RegisterDeepLink(app.app_handle());
    CreateTray(app.handle());
    Serve::CreateLocalServer(app.handle());
    Ok(())
}

pub fn IsExistApp() -> bool {
    !is_local_ipv4_port_free(PORT)
}

pub async fn FocusFirstApp() {
    let argvs: Vec<String> = std::env::args().collect();
    if argvs.len() > 1 {
        let _ = tauri_plugin_http::reqwest::ClientBuilder::new()
            .build()
            .unwrap()
            .get(format!(
                "http://localhost:{}/deeplink?url={}",
                PORT, argvs[1]
            ))
            .send()
            .await;
    } else {
        let _ = tauri_plugin_http::reqwest::ClientBuilder::new()
            .build()
            .unwrap()
            .get(format!("http://localhost:{}/secondinstance", PORT))
            .send()
            .await;
    }
}
