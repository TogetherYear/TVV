use actix_files as fs;
use actix_web::{get, middleware, web, App as AApp, HttpRequest, HttpResponse, HttpServer};
use serde_json::json;
use std::{sync::Mutex, thread};
use tauri::{command, App, AppHandle, Emitter, Manager};

use crate::Extra::TauriSendRendererPayload;

///后台服务端口
pub const PORT: u16 = 34290;

struct TauriAppState {
    app: Mutex<AppHandle>,
}

#[command]
pub fn GetLocalServerProt() -> u16 {
    return PORT;
}

pub fn CreateLocalServer(app: &mut App) {
    let handle = app.handle().clone();
    let boxHandle = Box::new(handle);
    thread::Builder::new()
        .name(String::from("LocalServer"))
        .spawn(move || ActixServer(*boxHandle))
        .unwrap();
}

#[actix_web::main]
async fn ActixServer(app: AppHandle) -> std::io::Result<()> {
    let path = format!(
        "{}{}",
        app.path()
            .resource_dir()
            .unwrap()
            .to_str()
            .unwrap()
            .replace("\\\\?\\", "")
            .replace("//", "/")
            .replace("\\", "/"),
        "/Extra/"
    );
    let tauriApp = web::Data::new(TauriAppState {
        app: Mutex::new(app),
    });
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
            .app_data(tauriApp.clone())
            .service(fs::Files::new("/Static", &path))
            .service(SecondInstance)
    })
    .bind(("127.0.0.1", PORT))
    .unwrap()
    .run()
    .await
}

#[get("/SecondInstance")]
async fn SecondInstance(_req: HttpRequest, state: web::Data<TauriAppState>) -> HttpResponse {
    let app = state.app.lock().unwrap();
    app.emit_to(
        "Application",
        "tauri://tauri",
        TauriSendRendererPayload {
            event: String::from("SecondInstance"),
            extra: json!({}),
        },
    )
    .unwrap();
    HttpResponse::Ok().body("SecondInstance")
}
