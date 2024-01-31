use image::{imageops::FilterType, ImageFormat};

use serde::{Deserialize, Serialize};

use window_shadows::set_shadow;

use tauri::command;

use autopilot::{geometry, mouse};

use enigo::{Enigo, KeyboardControllable};

#[command]
pub async fn InvokeTest() -> String {
    String::from("去码头整点薯条")
}

#[command]
pub fn SetWindowShadow(window: tauri::Window, enable: bool) {
    set_shadow(&window, enable).unwrap();
}

#[command]
pub fn ConvertImageFormat(originPath: String, convertPath: String, options: String) {
    let options = TransformImageOptionsFromJson(options);
    let mut r = image::open(originPath).unwrap();
    if options.width != 0
        && options.height != 0
        && (options.width != r.width() || options.height != r.height())
    {
        match options.keepAspectRatio {
            true => {
                r = r.resize(
                    options.width,
                    options.height,
                    TransformFilter(options.filter),
                )
            }
            false => {
                r = r.resize_exact(
                    options.width,
                    options.height,
                    TransformFilter(options.filter),
                )
            }
        }
    }
    r.save_with_format(convertPath, TransformFormat(options.format))
        .unwrap();
}

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
pub fn GetMousePosition() -> Point {
    let t = mouse::location();
    Point::New(t.x, t.y)
}

#[command]
pub fn SetMousePosition(x: f64, y: f64) {
    mouse::move_to(geometry::Point::new(x, y)).unwrap();
}

#[command]
pub fn SetButtonClick(button: u32, delay: u64) {
    match button {
        0 => mouse::click(mouse::Button::Left, Some(delay)),
        1 => mouse::click(mouse::Button::Middle, Some(delay)),
        _ => mouse::click(mouse::Button::Right, Some(delay)),
    }
}

#[command]
pub fn SetButtonToggle(button: u32, down: bool) {
    match button {
        0 => mouse::toggle(mouse::Button::Left, down),
        1 => mouse::toggle(mouse::Button::Middle, down),
        _ => mouse::toggle(mouse::Button::Right, down),
    }
}

#[command]
pub fn SetMouseScroll(direction: u32, clicks: u32) {
    match direction {
        0 => mouse::scroll(mouse::ScrollDirection::Down, clicks),
        _ => mouse::scroll(mouse::ScrollDirection::Up, clicks),
    }
}

#[command]
pub fn GetColorFromPosition(x: f64, y: f64) -> Color {
    let monitor = xcap::Monitor::from_point(x as i32, y as i32).unwrap();
    let capture = monitor.capture_image().unwrap();
    let pixel = capture.get_pixel_checked(
        ((x as i32) - monitor.x()) as u32,
        ((y as i32) - monitor.y()) as u32,
    );
    match pixel {
        Some(color) => Color::New(color.0[0], color.0[1], color.0[2], color.0[3]),
        None => Color::Default(),
    }
}

#[command]
pub fn GetCurrentPositionColor() -> Color {
    let point = mouse::location();
    GetColorFromPosition(point.x, point.y)
}

#[command]
pub fn WriteText(content: String, paste: bool) {
    let mut e = Enigo::new();
    match paste {
        true => {
            e.key_down(enigo::Key::Control);
            e.key_click(enigo::Key::V);
            e.key_up(enigo::Key::Control);
        }
        false => e.key_sequence(content.as_str()),
    }
}

#[command]
pub fn SetKeysToggle(json: String) {
    let mut e = Enigo::new();
    let toggleKeys = TransformToggleKeysFromJson(json);
    for toggleKey in toggleKeys {
        match toggleKey.down {
            true => e.key_down(TransformKey(toggleKey.key)),
            false => e.key_up(TransformKey(toggleKey.key)),
        }
    }
}

#[command]
pub fn SetKeysClick(keys: Vec<u32>) {
    let mut e = Enigo::new();
    for key in keys {
        e.key_click(TransformKey(key));
    }
}

fn TransformKey(key: u32) -> enigo::Key {
    match key {
        0 => enigo::Key::Num0,
        1 => enigo::Key::Num1,
        2 => enigo::Key::Num2,
        3 => enigo::Key::Num3,
        4 => enigo::Key::Num4,
        5 => enigo::Key::Num5,
        6 => enigo::Key::Num6,
        7 => enigo::Key::Num7,
        8 => enigo::Key::Num8,
        9 => enigo::Key::Num9,
        10 => enigo::Key::A,
        11 => enigo::Key::B,
        12 => enigo::Key::C,
        13 => enigo::Key::D,
        14 => enigo::Key::E,
        15 => enigo::Key::F,
        16 => enigo::Key::G,
        17 => enigo::Key::H,
        18 => enigo::Key::I,
        19 => enigo::Key::J,
        20 => enigo::Key::K,
        21 => enigo::Key::L,
        22 => enigo::Key::M,
        23 => enigo::Key::N,
        24 => enigo::Key::O,
        25 => enigo::Key::P,
        26 => enigo::Key::Q,
        27 => enigo::Key::R,
        28 => enigo::Key::S,
        29 => enigo::Key::T,
        30 => enigo::Key::U,
        31 => enigo::Key::V,
        32 => enigo::Key::W,
        33 => enigo::Key::X,
        34 => enigo::Key::Y,
        35 => enigo::Key::Z,
        36 => enigo::Key::Add,
        37 => enigo::Key::Subtract,
        38 => enigo::Key::Multiply,
        39 => enigo::Key::Divide,
        40 => enigo::Key::OEM2,
        41 => enigo::Key::Tab,
        42 => enigo::Key::CapsLock,
        43 => enigo::Key::Shift,
        44 => enigo::Key::Control,
        45 => enigo::Key::Alt,
        46 => enigo::Key::Space,
        47 => enigo::Key::Backspace,
        48 => enigo::Key::Return,
        49 => enigo::Key::Escape,
        50 => enigo::Key::UpArrow,
        51 => enigo::Key::DownArrow,
        52 => enigo::Key::LeftArrow,
        53 => enigo::Key::RightArrow,
        _ => enigo::Key::T,
    }
}

fn TransformToggleKeysFromJson(json: String) -> Vec<ToggleKey> {
    serde_json::from_str::<ToggleKeysJson>(json.as_str())
        .unwrap()
        .toggleKeys
}

fn TransformImageOptionsFromJson(json: String) -> ImageOptions {
    serde_json::from_str::<ImageOptions>(json.as_str()).unwrap()
}

fn TransformFormat(format: u32) -> ImageFormat {
    match format {
        0 => ImageFormat::Png,
        1 => ImageFormat::Jpeg,
        2 => ImageFormat::Gif,
        3 => ImageFormat::WebP,
        4 => ImageFormat::Pnm,
        5 => ImageFormat::Tiff,
        6 => ImageFormat::Tga,
        7 => ImageFormat::Dds,
        8 => ImageFormat::Bmp,
        9 => ImageFormat::Ico,
        10 => ImageFormat::Hdr,
        11 => ImageFormat::OpenExr,
        12 => ImageFormat::Farbfeld,
        13 => ImageFormat::Avif,
        14 => ImageFormat::Qoi,
        _ => ImageFormat::WebP,
    }
}

fn TransformFilter(filter: u32) -> FilterType {
    match filter {
        0 => FilterType::Nearest,
        1 => FilterType::Triangle,
        2 => FilterType::CatmullRom,
        3 => FilterType::Gaussian,
        4 => FilterType::Lanczos3,
        _ => FilterType::Nearest,
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

#[derive(Serialize, Deserialize)]
pub struct ImageOptions {
    format: u32,
    keepAspectRatio: bool,
    width: u32,
    height: u32,
    filter: u32,
}
