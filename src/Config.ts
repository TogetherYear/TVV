function Tauri() {
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
    })
}

export { Tauri }