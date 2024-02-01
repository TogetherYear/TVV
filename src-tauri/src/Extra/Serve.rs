use std::thread;

use tauri::App;

pub fn CreateServe(app: &mut App) {
    let path = format!(
        "{}{}",
        app.path_resolver()
            .resource_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .replace("\\\\?\\", "")
            .replace("//", "/")
            .replace("\\", "/"),
        "/Need/"
    );
    thread::Builder::new()
        .name(String::from("HttpServe"))
        .spawn(move || {
            file_serve::ServerBuilder::new(&path)
                .port(8676)
                .build()
                .serve()
                .unwrap();
        })
        .unwrap();
}
