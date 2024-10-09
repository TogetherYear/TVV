#![allow(non_snake_case)]

use tauri::async_runtime::block_on;
use Extra::Setup::{FocusFirstApp, IsExistApp};

mod Extra;

mod Addon;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    if !IsExistApp() {
        tauri::Builder::default()
            .setup(Extra::Setup::Init)
            .plugin(tauri_plugin_autostart::init(
                tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                Some(vec![]),
            ))
            .plugin(tauri_plugin_process::init())
            .plugin(tauri_plugin_dialog::init())
            .plugin(tauri_plugin_http::init())
            .plugin(tauri_plugin_fs::init())
            .plugin(tauri_plugin_shell::init())
            .plugin(tauri_plugin_global_shortcut::Builder::new().build())
            .plugin(tauri_plugin_clipboard_manager::init())
            .invoke_handler(Addon::Generate())
            .run(tauri::generate_context!())
            .expect("error while building tauri application");
    } else {
        block_on(FocusFirstApp());
    }
}
