use crate::Extra::Serve;
use tauri::generate_handler;

pub fn Generate() -> impl Fn(tauri::ipc::Invoke) -> bool {
    generate_handler![Serve::GetLocalServerProt]
}
