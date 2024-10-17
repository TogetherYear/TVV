use crate::Extra::Serve;
use crate::Extra::Tray;
use tauri::generate_handler;

pub fn Generate() -> impl Fn(tauri::ipc::Invoke) -> bool {
    generate_handler![
        Serve::GetLocalServerProt,
        Tray::SetTrayIcon,
        Tray::SetTrayTooltip,
        Tray::UpdateMenu
    ]
}
