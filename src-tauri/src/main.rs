#![allow(non_snake_case)]
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    generate_context, generate_handler, Builder, Manager, PhysicalPosition, SystemTray,
    SystemTrayEvent,
};

use window_shadows::set_shadow;

use windows_sys::Win32::{Foundation::POINT, UI::WindowsAndMessaging::GetCursorPos};

#[tauri::command]
fn RustTest() -> String {
    String::from("去码头整点薯条:Rust!")
}

fn GetCursorPosition() -> Option<(i32, i32)> {
    let mut pt = POINT { x: -1, y: -1 };
    let ret = unsafe { GetCursorPos(&mut pt) };
    if ret != 1 || pt.x == -1 && pt.y == -1 {
        None
    } else {
        Some((pt.x, pt.y))
    }
}

fn main() {
    Builder::default()
        .setup(|app| {
            let windowA = app.get_window("Application").unwrap();
            set_shadow(&windowA, true).expect("Unsupported platform!");
            Ok(())
        })
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            let window = app.get_window("Application").unwrap();
            if window.is_minimized().unwrap() {
                window.unminimize().unwrap();
            } else {
                window.show().unwrap();
            }
            window.set_focus().unwrap();
        }))
        .invoke_handler(generate_handler![RustTest,])
        .system_tray(SystemTray::new().with_tooltip("去码头整点薯条"))
        .on_system_tray_event(|app, event| match event {
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
                let point = GetCursorPosition().unwrap();
                let size = window.inner_size().unwrap();
                window
                    .set_position(PhysicalPosition::new(
                        (point.0 as u32) - size.width + 2,
                        (point.1 as u32) - size.height + 2,
                    ))
                    .unwrap();
                window.set_always_on_top(true).unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            _ => {}
        })
        .run(generate_context!())
        .expect("Error while running tauri application");
}
