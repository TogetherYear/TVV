use crate::Extra::Serve;
use crate::Extra::Tray;
use tauri::generate_handler;

pub fn Generate() -> impl Fn(tauri::ipc::Invoke) -> bool {
    generate_handler![
        Tray::SetTrayIcon,
        Tray::SetTrayTooltip,
        Serve::GetLocalServerPort,
    ]
}
