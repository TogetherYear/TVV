function Tauri() {
    window.addEventListener('contextmenu', (e) => {
        e.stopPropagation()
        e.preventDefault()
    })
}

export { Tauri }