use crate::Extra::Tray;
use tauri::generate_handler;

pub mod Widget;

pub fn Generate() -> impl Fn(tauri::Invoke) {
    generate_handler![
        Widget::SetShadow,
        Tray::SetTrayIcon,
        Tray::SetTrayTooltip,
        Tray::UpdateAutostartFlag,
    ]
}
