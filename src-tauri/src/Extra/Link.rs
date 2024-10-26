use tauri::AppHandle;
use tauri_plugin_deep_link::DeepLinkExt;

///深度链接协议
pub const PROTOCOL: &str = "tvv-chips";

pub fn RegisterDeepLink(app: &AppHandle) {
    app.deep_link().register(PROTOCOL).unwrap();
}
