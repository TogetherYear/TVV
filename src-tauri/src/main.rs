#![allow(non_snake_case)]
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn Introduce() -> String {
    String::from("去码头整点薯条:Rust!")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![Introduce])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
