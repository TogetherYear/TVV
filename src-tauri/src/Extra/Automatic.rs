use serde::{Deserialize, Serialize};

use tauri::command;

use autopilot::{geometry, mouse, screen};

use enigo::{Enigo, KeyboardControllable};

#[command]
pub fn GetMousePosition() -> Point {
    let t = mouse::location();
    Point { x: t.x, y: t.y }
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
    let point = geometry::Point::new(x, y);
    match screen::is_point_visible(point) {
        true => {
            let t = screen::get_color(point).unwrap();
            Color {
                r: t.0[0],
                g: t.0[1],
                b: t.0[2],
                a: t.0[3],
            }
        }
        false => Color {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
        },
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

#[derive(Clone, serde::Serialize)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[derive(Clone, serde::Serialize)]
pub struct Color {
    r: u8,
    g: u8,
    b: u8,
    a: u8,
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

#[derive(Serialize, Deserialize)]
pub struct ToggleKeysJson {
    toggleKeys: Vec<ToggleKey>,
}

#[derive(Serialize, Deserialize)]
pub struct ToggleKey {
    key: u32,
    down: bool,
}
