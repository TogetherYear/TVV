use tauri::command;

use autopilot::{geometry, mouse, screen};

#[command]
pub fn GetMousePosition() -> Point {
    let t = mouse::location();
    Point { x: t.x, y: t.y }
}

#[command]
pub fn SetMousePosition(x: f64, y: f64) {
    mouse::move_to(geometry::Point::new(x, y)).unwrap()
}

#[command]
pub fn SetButtonClick(button: u32, delay: u64) {
    if button == 0 {
        mouse::click(mouse::Button::Left, Some(delay));
    } else if button == 1 {
        mouse::click(mouse::Button::Middle, Some(delay));
    } else {
        mouse::click(mouse::Button::Right, Some(delay));
    }
}

#[command]
pub fn SetButtonToggle(button: u32, down: bool) {
    if button == 0 {
        mouse::toggle(mouse::Button::Left, down);
    } else if button == 1 {
        mouse::toggle(mouse::Button::Middle, down);
    } else {
        mouse::toggle(mouse::Button::Right, down);
    }
}

#[command]
pub fn SetMouseScroll(direction: u32, clicks: u32) {
    if direction == 0 {
        mouse::scroll(mouse::ScrollDirection::Down, clicks);
    } else {
        mouse::scroll(mouse::ScrollDirection::Up, clicks);
    }
}

#[command]
pub fn GetColorFromPosition(x: f64, y: f64) -> Color {
    let point = geometry::Point::new(x, y);
    if screen::is_point_visible(point) {
        let t = screen::get_color(point).unwrap();
        Color {
            r: t.0[0],
            g: t.0[1],
            b: t.0[2],
            a: t.0[3],
        }
    } else {
        Color {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
        }
    }
}

#[command]
pub fn GetCurrentPositionColor() -> Color {
    let point = mouse::location();
    if screen::is_point_visible(point) {
        let t = screen::get_color(mouse::location()).unwrap();
        Color {
            r: t.0[0],
            g: t.0[1],
            b: t.0[2],
            a: t.0[3],
        }
    } else {
        Color {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
        }
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
