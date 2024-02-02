use tauri::generate_handler;

pub mod Automatic;
pub mod Image;
pub mod Power;
pub mod Widget;

pub fn Generate() -> impl Fn(tauri::Invoke) {
    generate_handler![
        Widget::SetShadow,
        Image::ConvertImageFormat,
        Automatic::GetMousePosition,
        Automatic::SetMousePosition,
        Automatic::SetButtonClick,
        Automatic::SetButtonToggle,
        Automatic::SetMouseScroll,
        Automatic::GetColorFromPosition,
        Automatic::GetCurrentPositionColor,
        Automatic::WriteText,
        Automatic::SetKeysToggle,
        Automatic::SetKeysClick,
        Power::GetAllWindows,
        Power::CaptureWindow,
        Power::GetWindowCurrentMonitor,
        Power::GetAllMonitors,
        Power::GetMonitorFromPoint,
        Power::GetCurrentMouseMonitor,
        Power::GetPrimaryMonitor,
        Power::CaptureMonitor,
        Power::GetWallpaper,
        Power::SetWallpaper,
    ]
}
