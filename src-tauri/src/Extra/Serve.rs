use actix_files as fs;
use actix_web::{get, middleware, App as AApp, HttpResponse, HttpServer};
use std::thread;
use tauri::App;

pub fn CreateLocalServer(app: &mut App) {
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
        "/Extra/"
    );
    thread::Builder::new()
        .name(String::from("LocalServer"))
        .spawn(move || ActixServer(path))
        .unwrap();
}

#[actix_web::main]
async fn ActixServer(path: String) -> std::io::Result<()> {
    HttpServer::new(move || {
        AApp::new()
            .wrap(
                middleware::DefaultHeaders::new()
                    .add(("Access-Control-Allow-Origin", "*"))
                    .add(("Access-Control-Allow-Methods", "GET,POST"))
                    .add(("Access-Control-Allow-Headers", "Content-Type"))
                    .add(("Access-Control-Allow-Credentials", "true"))
                    .add(("Cross-Origin-Embedder-Policy", "require-corp"))
                    .add(("Cross-Origin-Opener-Policy", "same-origin")),
            )
            .service(fs::Files::new("/Static", path.as_str()))
            .service(Test)
    })
    .bind(("127.0.0.1", 8676))
    .unwrap()
    .run()
    .await
}

#[get("/Test")]
async fn Test() -> HttpResponse {
    HttpResponse::Ok().body("Test")
}
