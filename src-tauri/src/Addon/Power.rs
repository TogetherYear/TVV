use image::ImageFormat;

use serde::{Deserialize, Serialize};

use tauri::command;

use super::Automatic::GetMousePosition;

#[command]
pub fn GetAllWindows() -> Vec<Window> {
    let windows = xcap::Window::all().unwrap();
    let mut ws: Vec<Window> = vec![];
    for window in windows {
        ws.push(Window::New(window));
    }
    ws
}

#[command]
pub fn CaptureWindow(id: u32, path: String) -> bool {
    let windows = xcap::Window::all().unwrap();
    for w in windows {
        if w.id() == id && !w.is_minimized() {
            w.capture_image()
                .unwrap()
                .save_with_format(path, ImageFormat::WebP)
                .unwrap();
            return true;
        }
    }
    false
}

#[command]
pub fn GetWindowCurrentMonitor(id: u32) -> Monitor {
    let windows = xcap::Window::all().unwrap();
    for w in windows {
        if w.id() == id {
            return Monitor::New(w.current_monitor());
        }
    }
    Monitor::Default()
}

#[command]
pub fn GetAllMonitors() -> Vec<Monitor> {
    let monitors = xcap::Monitor::all().unwrap();
    let mut ms: Vec<Monitor> = vec![];
    for monitor in monitors {
        ms.push(Monitor::New(monitor));
    }
    ms
}

#[command]
pub fn GetMonitorFromPoint(x: i32, y: i32) -> Monitor {
    Monitor::New(xcap::Monitor::from_point(x, y).unwrap())
}

#[command]
pub fn GetCurrentMouseMonitor() -> Monitor {
    let point = GetMousePosition();
    Monitor::New(xcap::Monitor::from_point(point.x as i32, point.y as i32).unwrap())
}

#[command]
pub fn GetPrimaryMonitor() -> Monitor {
    let monitors = xcap::Monitor::all().unwrap();
    for m in monitors {
        if m.is_primary() {
            return Monitor::New(m);
        }
    }
    Monitor::Default()
}

#[command]
pub fn CaptureMonitor(id: u32, path: String) -> bool {
    let monitors = xcap::Monitor::all().unwrap();
    for m in monitors {
        if m.id() == id {
            m.capture_image()
                .unwrap()
                .save_with_format(path, ImageFormat::WebP)
                .unwrap();
            return true;
        }
    }
    false
}

#[command]
pub fn GetWallpaper() -> String {
    wallpaper::get().unwrap()
}

#[command]
pub fn SetWallpaper(path: String, mode: u32) {
    wallpaper::set_from_path(path.as_str()).unwrap();
    wallpaper::set_mode(TransformMode(mode)).unwrap();
}

fn TransformMode(mode: u32) -> wallpaper::Mode {
    match mode {
        0 => wallpaper::Mode::Center,
        1 => wallpaper::Mode::Crop,
        2 => wallpaper::Mode::Fit,
        3 => wallpaper::Mode::Span,
        4 => wallpaper::Mode::Stretch,
        5 => wallpaper::Mode::Tile,
        _ => wallpaper::Mode::Crop,
    }
}

#[derive(Clone, serde::Serialize)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

impl Point {
    pub fn New(x: f64, y: f64) -> Point {
        Point { x, y }
    }
}

#[derive(Clone, serde::Serialize)]
pub struct Color {
    r: u8,
    g: u8,
    b: u8,
    a: u8,
}

impl Color {
    pub fn New(r: u8, g: u8, b: u8, a: u8) -> Color {
        Color { r, g, b, a }
    }

    pub fn Default() -> Color {
        Color {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct ToggleKeysJson {
    toggleKeys: Vec<ToggleKey>,
}

#[derive(Serialize, Deserialize)]
pub struct ToggleKey {
    key: u32,
    down: bool,
}

#[derive(Clone, serde::Serialize)]
pub struct Window {
    pub id: u32,
    pub title: String,
    pub appName: String,
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
    pub isMinimized: bool,
    pub isMaximized: bool,
}

impl Window {
    pub fn New(w: xcap::Window) -> Window {
        Window {
            id: w.id(),
            title: w.title().to_string(),
            appName: w.app_name().to_string(),
            x: w.x(),
            y: w.y(),
            width: w.width(),
            height: w.height(),
            isMinimized: w.is_minimized(),
            isMaximized: w.is_maximized(),
        }
    }
}

#[derive(Clone, serde::Serialize)]
pub struct Monitor {
    pub id: u32,
    pub name: String,
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
    pub rotation: f32,
    pub scaleFactor: f32,
    pub frequency: f32,
    pub isPrimary: bool,
}

impl Monitor {
    pub fn New(m: xcap::Monitor) -> Monitor {
        Monitor {
            id: m.id(),
            name: m.name().to_string(),
            x: m.x(),
            y: m.y(),
            width: m.width(),
            height: m.height(),
            rotation: m.rotation(),
            scaleFactor: m.scale_factor(),
            frequency: m.frequency(),
            isPrimary: m.is_primary(),
        }
    }

    pub fn Default() -> Monitor {
        Monitor {
            id: 0,
            name: String::from(""),
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            rotation: 0.,
            scaleFactor: 0.,
            frequency: 0.,
            isPrimary: false,
        }
    }
}
