#![allow(non_snake_case)]
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{generate_context, Builder};

mod Extra;

fn main() {
    Builder::default()
        .setup(Extra::Setup::Init)
        .plugin(tauri_plugin_single_instance::init(
            Extra::Singleton::OnSecondInstance,
        ))
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_fs_extra::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(Extra::Handler::Generate())
        .on_window_event(Extra::Setup::OnWindowEvent)
        .system_tray(Extra::Tray::Build())
        .on_system_tray_event(Extra::Tray::OnEvent)
        .run(generate_context!())
        .expect("Error while running tauri application");
}
