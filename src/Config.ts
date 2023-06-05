import { appWindow } from "@tauri-apps/api/window"

function Tauri() {
    window.addEventListener('contextmenu', (e) => {
        e.stopPropagation()
        e.preventDefault()
    })
    appWindow.once('tauri://window-created', async () => {
        await appWindow.show()
        await appWindow.setFocus()
    })
}

export { Tauri }