use tauri::generate_handler;

use crate::Extra;

pub fn Generate() -> impl Fn(tauri::Invoke) {
    generate_handler![
        Extra::Power::InvokeTest,
        Extra::Power::SetWindowShadow,
        Extra::Power::ConvertImageFormat,
        Extra::Power::GetMousePosition,
        Extra::Power::SetMousePosition,
        Extra::Power::SetButtonClick,
        Extra::Power::SetButtonToggle,
        Extra::Power::SetMouseScroll,
        Extra::Power::GetColorFromPosition,
        Extra::Power::GetCurrentPositionColor,
        Extra::Power::WriteText,
        Extra::Power::SetKeysToggle,
        Extra::Power::SetKeysClick,
        Extra::Power::GetAllWindows,
        Extra::Power::CaptureWindow,
        Extra::Power::GetWindowCurrentMonitor,
        Extra::Power::GetAllMonitors,
        Extra::Power::GetMonitorFromPoint,
        Extra::Power::GetCurrentMouseMonitor,
        Extra::Power::GetPrimaryMonitor,
        Extra::Power::CaptureMonitor,
    ]
}
