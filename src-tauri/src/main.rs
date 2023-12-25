#![allow(non_snake_case)]
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    generate_context, generate_handler, Builder, CustomMenuItem, Manager, SystemTray,
    SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}

#[tauri::command]
fn Introduce() -> String {
    String::from("去码头整点薯条:Rust!")
}

fn main() {
    Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            let _p = Payload { args: argv, cwd };
            let window = app.get_window("Application").unwrap();
            window.show().unwrap();
        }))
        .invoke_handler(generate_handler![Introduce])
        .system_tray(
            SystemTray::new().with_menu(
                SystemTrayMenu::new()
                    .add_item(CustomMenuItem::new("show".to_string(), "显示"))
                    .add_native_item(SystemTrayMenuItem::Separator)
                    .add_item(CustomMenuItem::new("quit".to_string(), "退出")),
            ),
        )
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("Application").unwrap();
                window.show().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    let window = app.get_window("Application").unwrap();
                    window.close().unwrap();
                    // std::process::exit(0);
                }
                "show" => {
                    let window = app.get_window("Application").unwrap();
                    window.show().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .run(generate_context!())
        .expect("error while running tauri application");
}
