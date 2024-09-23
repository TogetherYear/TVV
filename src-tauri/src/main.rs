#![allow(non_snake_case)]
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{async_runtime::block_on, generate_context, Builder};
use Extra::Setup::{FocusFirstApp, IsExistApp};

mod Extra;

mod Addon;

fn main() {
    if !IsExistApp() {
        Builder::default()
            .setup(Extra::Setup::Init)
            .plugin(tauri_plugin_autostart::init(
                tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                Some(vec![]),
            ))
            .invoke_handler(Addon::Generate())
            .on_window_event(Extra::Window::OnWindowEvent)
            .system_tray(Extra::Tray::Build())
            .on_system_tray_event(Extra::Tray::OnEvent)
            .build(generate_context!())
            .expect("error while building tauri application")
            .run(Extra::App::Run);
    } else {
        block_on(FocusFirstApp());
    }
}
