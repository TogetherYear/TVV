use tauri::generate_handler;

use crate::Extra;

pub fn Generate() -> impl Fn(tauri::Invoke) {
    generate_handler![
        Extra::Automatic::GetMousePosition,
        Extra::Automatic::SetMousePosition,
        Extra::Automatic::SetButtonClick,
        Extra::Automatic::SetButtonToggle,
        Extra::Automatic::SetMouseScroll,
        Extra::Automatic::GetColorFromPosition,
        Extra::Automatic::GetCurrentPositionColor,
        Extra::Automatic::WriteText,
        Extra::Automatic::SetKeysToggle,
        Extra::Automatic::SetKeysClick,
    ]
}
