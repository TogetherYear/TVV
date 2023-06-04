import {
    create,
    NConfigProvider,
    NMessageProvider,
    NDialogProvider,
    NButton,
    GlobalThemeOverrides,
    darkTheme
} from 'naive-ui'

/**
 * components
 */
const naive = create({
    components: [
        NConfigProvider,
        NMessageProvider,
        NDialogProvider,
        NButton
    ]
})

/**
 * theme
 */
const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#333333',
        primaryColorHover: '#333333',
        primaryColorPressed: '#333333',
    },
    Message: darkTheme.Message,
    Dialog: darkTheme.Dialog,
    // Button: {
    //     textColor: '#FF0000'
    // }
}

export { naive, themeOverrides }