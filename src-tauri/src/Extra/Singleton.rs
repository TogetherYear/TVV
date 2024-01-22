use tauri::{AppHandle, Manager};

pub fn OnSecondInstance(app: &AppHandle, _argv: Vec<String>, _cwd: String) {
    let window = app.get_window("Application").unwrap();
    if window.is_minimized().unwrap() {
        window.unminimize().unwrap();
    } else {
        window.show().unwrap();
    }
    window.set_focus().unwrap();
    window
        .emit(
            "tauri://tauri",
            TauriSendRendererPayload {
                event: "SecondInstance",
                send: "",
            },
        )
        .unwrap();
}

#[derive(Clone, serde::Serialize)]
pub struct TauriSendRendererPayload<'a> {
    event: &'a str,
    send: &'a str,
}
