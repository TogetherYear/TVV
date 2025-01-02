use port_check::is_local_ipv4_port_free;
use tauri::{api::http::HttpRequestBuilder, App, Manager};

use super::Serve::{self, PORT};

pub fn Init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    Serve::CreateLocalServer(app.app_handle());
    Ok(())
}

pub fn IsExistApp() -> bool {
    !is_local_ipv4_port_free(PORT)
}

pub async fn FocusFirstApp() {
    let client = tauri::api::http::ClientBuilder::new().build().unwrap();
    let request =
        HttpRequestBuilder::new("GET", format!("http://localhost:{}/SecondInstance", PORT))
            .unwrap();
    let _ = client.send(request).await;
}
