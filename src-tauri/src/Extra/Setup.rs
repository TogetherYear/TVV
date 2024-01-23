use tauri::{App, Manager};

use window_shadows::set_shadow;

pub fn Init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    SetWindowShadow(app);
    Ok(())
}

fn SetWindowShadow(app: &mut App) {
    let window = app.get_window("Application").unwrap();
    set_shadow(&window, true).expect("Unsupported platform!");
}
