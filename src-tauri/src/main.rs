#![allow(non_snake_case)]
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    generate_context, generate_handler, Builder, Manager, PhysicalPosition, SystemTray,
    SystemTrayEvent,
};

use window_shadows::set_shadow;

use windows_sys::Win32::{Foundation::POINT, UI::WindowsAndMessaging::GetCursorPos};

fn main() {
    Builder::default()
        .setup(|app| {
            Ok({
                OnSetup(app);
            })
        })
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            OnSecondInstance(app);
        }))
        .invoke_handler(generate_handler![GetRustStruct])
        .system_tray(SystemTray::new().with_tooltip("去码头整点薯条"))
        .on_system_tray_event(|app, event| {
            OnTrayEvent(app, event);
        })
        .run(generate_context!())
        .expect("Error while running tauri application");
}

fn OnSetup(app: &mut tauri::App) {
    let shadowWindow = app.get_window("Application").unwrap();
    set_shadow(&shadowWindow, true).expect("Unsupported platform!");
}

fn OnSecondInstance(app: &tauri::AppHandle) {
    let window = app.get_window("Application").unwrap();
    if window.is_minimized().unwrap() {
        window.unminimize().unwrap();
    } else {
        window.show().unwrap();
    }
    window.set_focus().unwrap();
}

fn OnTrayEvent(app: &tauri::AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::DoubleClick {
            position: _,
            size: _,
            ..
        } => {
            let window = app.get_window("Application").unwrap();
            if window.is_minimized().unwrap() {
                window.unminimize().unwrap();
            } else {
                window.show().unwrap();
            }
            window.set_focus().unwrap();
        }
        SystemTrayEvent::RightClick {
            position: _,
            size: _,
            ..
        } => {
            let window = app.get_window("Tray").unwrap();
            let point = GetCursorPosition();
            let size = window.inner_size().unwrap();
            window
                .set_position(PhysicalPosition::new(
                    (point.x as u32) - size.width + 2,
                    (point.y as u32) - size.height + 2,
                ))
                .unwrap();
            window.set_always_on_top(true).unwrap();
            window.show().unwrap();
            window.set_focus().unwrap();
        }
        _ => {}
    }
}

fn GetCursorPosition() -> POINT {
    let mut pt = POINT { x: -1, y: -1 };
    unsafe {
        GetCursorPos(&mut pt);
    };
    pt
}

#[derive(Clone, serde::Serialize)]
struct Rect {
    left: i32,
    right: i32,
    top: i32,
    bottom: i32,
}

#[tauri::command]
fn GetRustStruct() -> Rect {
    Rect {
        left: -1,
        right: -1,
        top: -1,
        bottom: -1,
    }
}
