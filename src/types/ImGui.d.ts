declare namespace ImGui {
    export function GetIO(): ImGuiIO;
    export class ImGuiIO {
        get Fonts(): ImFontAtlas
    }
    export class ImFontAtlas {
        AddFontFromMemoryTTF(data: ArrayBuffer, size_pixels: number, font_cfg?: ImFontConfig | null, glyph_ranges?: number | null): ImFont;
        GetGlyphRangesDefault(): number;
        GetGlyphRangesKorean(): number;
        GetGlyphRangesJapanese(): number;
        GetGlyphRangesChineseFull(): number;
        GetGlyphRangesChineseSimplifiedCommon(): number;
        GetGlyphRangesCyrillic(): number;
        GetGlyphRangesThai(): number;
        GetGlyphRangesVietnamese(): number;
        AddFontDefault(font_cfg?: ImFontConfig | null): ImFont;
    }
    export class ImFontConfig {
        readonly internal: ImFontConfig;
        constructor(internal?: ImFontConfig);
        get FontData(): DataView | null;
        get FontDataOwnedByAtlas(): boolean;
        get FontNo(): number;
        get SizePixels(): number;
        get OversampleH(): number;
        get OversampleV(): number;
        get PixelSnapH(): boolean;
        get GlyphExtraSpacing(): ImVec2;
        get GlyphOffset(): ImVec2;
        get GlyphRanges(): number | null;
        get GlyphMinAdvanceX(): number;
        get GlyphMaxAdvanceX(): number;
        get MergeMode(): boolean;
        get FontBuilderFlags(): number;
        get RasterizerMultiply(): number;
        get Name(): string;
        set Name(value: string);
        get DstFont(): ImFont | null;
    }

    export class ImVector<T> extends Array<T> {
        get Size(): number;
        Data: T[];
        empty(): boolean;
        clear(): void;
        pop_back(): T | undefined;
        push_back(value: T): void;
        front(): T;
        back(): T;
        size(): number;
        resize(new_size: number, v?: (index: number) => T): void;
        contains(value: T): boolean;
        find_erase_unsorted(value: T): void;
    }
    export class ImFontGlyph implements ImFontGlyph {
        readonly internal: ImFontGlyph;
        constructor(internal?: ImFontGlyph);
        get Colored(): boolean;
        get Visible(): boolean;
        get Codepoint(): number;
        get AdvanceX(): number;
        get X0(): number;
        get Y0(): number;
        get X1(): number;
        get Y1(): number;
        get U0(): number;
        get V0(): number;
        get U1(): number;
        get V1(): number;
    }
    export class ImDrawList {

    }
    export class ImFont {
        readonly native: ImFont;
        constructor(native: ImFont);
        get FontSize(): number;
        get Scale(): number;
        set Scale(value: number);
        get Glyphs(): ImVector<ImFontGlyph>;
        get FallbackGlyph(): ImFontGlyph | null;
        set FallbackGlyph(value: ImFontGlyph | null);
        get FallbackAdvanceX(): number;
        get FallbackChar(): number;
        get EllipsisChar(): number;
        get DotChar(): number;
        get ConfigDataCount(): number;
        get ConfigData(): ImFontConfig[];
        get ContainerAtlas(): ImFontAtlas | null;
        get Ascent(): number;
        get Descent(): number;
        get MetricsTotalSurface(): number;
        ClearOutputData(): void;
        BuildLookupTable(): void;
        FindGlyph(c: number): Readonly<ImFontGlyph> | null;
        FindGlyphNoFallback(c: number): ImFontGlyph | null;
        GetCharAdvance(c: number): number;
        IsLoaded(): boolean;
        GetDebugName(): string;
        CalcTextSizeA(size: number, max_width: number, wrap_width: number, text_begin: string, text_end?: number | null, remaining?: ImScalar<number> | null): ImVec2;
        CalcWordWrapPositionA(scale: number, text: string, text_end: number | null | undefined, wrap_width: number): number;
        RenderChar(draw_list: ImDrawList, size: number, pos: Readonly<ImVec2>, col: ImU32, c: ImWchar): void;
        RenderText(draw_list: ImDrawList, size: number, pos: Readonly<ImVec2>, col: ImU32, clip_rect: Readonly<ImVec4>, text_begin: string, text_end?: number | null, wrap_width?: number, cpu_fine_clip?: boolean): void;
        IsGlyphRangeUnused(c_begin: number, c_last: number): boolean;
    }
    export type ImWchar = number;
    export function CreateContext(): void;
    export function StyleColorsDark(dst?: ImGuiStyle | null): void;
    export function StyleColorsLight(dst?: ImGuiStyle | null): void;
    export function StyleColorsClassic(dst?: ImGuiStyle | null): void;
    export type ImU32 = number;
    export function NewFrame(): void;
    export function Separator(): void;
    export function End(): void;
    export function EndFrame(): void;
    export function Render(): void;
    export function GetDrawData(): any;
    export type ImAccess<T> = (value?: T) => T;
    export type ImScalar<T> = [T];
    export function Begin(name: string, open?: ImScalar<boolean> | ImAccess<boolean> | null, flags?: ImGuiWindowFlags): boolean;
    export enum ImGuiWindowFlags {
        None = 0,
        NoTitleBar = 1,
        NoResize = 2,
        NoMove = 4,
        NoScrollbar = 8,
        NoScrollWithMouse = 16,
        NoCollapse = 32,
        AlwaysAutoResize = 64,
        NoBackground = 128,
        NoSavedSettings = 256,
        NoMouseInputs = 512,
        MenuBar = 1024,
        HorizontalScrollbar = 2048,
        NoFocusOnAppearing = 4096,
        NoBringToFrontOnFocus = 8192,
        AlwaysVerticalScrollbar = 16384,
        AlwaysHorizontalScrollbar = 32768,
        AlwaysUseWindowPadding = 65536,
        NoNavInputs = 262144,
        NoNavFocus = 524288,
        UnsavedDocument = 1048576,
        NoNav = 786432,
        NoDecoration = 43,
        NoInputs = 786944,
        NavFlattened = 8388608,
        ChildWindow = 16777216,
        Tooltip = 33554432,
        Popup = 67108864,
        Modal = 134217728,
        ChildMenu = 268435456
    }
    export function DestroyContext(): void;
    export function ColorEdit4(key: string, value: ImVec4): void;
    export function IsWindowFocused(): boolean;
    export function GetWindowSize(out?: ImVec2): ImVec2;
    export function GetWindowPos(out?: ImVec2): ImVec2;
    export class ImVec4 {
        constructor(r: number, g: number, b: number, a: number);
    }
    export class ImVec2 {
        constructor(x: number, y: number);
    }
    export function Button(label: string, size?: Readonly<ImVec2>): boolean;
    export function Text(text: string): void;
    export function SameLine(posX?: number, spacingW?: number): void;
    export function Checkbox(label: string, v: ImScalar<boolean> | ImAccess<boolean>): boolean;
    export function InputText<T>(label: string, buf: ImStringBuffer | ImAccess<string> | ImScalar<string>, buf_size?: number, flags?: ImGuiInputTextFlags, callback?: ImGuiInputTextCallback<T> | null, user_data?: T | null): boolean;
    export function InputTextMultiline<T>(label: string, buf: ImStringBuffer | ImAccess<string> | ImScalar<string>, buf_size?: number, size?: Readonly<ImVec2>, flags?: ImGuiInputTextFlags, callback?: ImGuiInputTextCallback<T> | null, user_data?: T | null): boolean;
    export class ImStringBuffer {
        size: number;
        buffer: string;
        constructor(size: number, buffer?: string);
    }
    export enum ImGuiInputTextFlags {
        None = 0,
        CharsDecimal = 1,
        CharsHexadecimal = 2,
        CharsUppercase = 4,
        CharsNoBlank = 8,
        AutoSelectAll = 16,
        EnterReturnsTrue = 32,
        CallbackCompletion = 64,
        CallbackHistory = 128,
        CallbackAlways = 256,
        CallbackCharFilter = 512,
        AllowTabInput = 1024,
        CtrlEnterForNewLine = 2048,
        NoHorizontalScroll = 4096,
        AlwaysOverwrite = 8192,
        ReadOnly = 16384,
        Password = 32768,
        NoUndoRedo = 65536,
        CharsScientific = 131072,
        CallbackResize = 262144,
        CallbackEdit = 524288,
        Multiline = 1048576,
        NoMarkEdited = 2097152
    }
    export type ImGuiInputTextCallback<T> = (data: ImGuiInputTextCallbackData<T>) => number;
    export class ImGuiInputTextCallbackData<T> {

    }

    export function SetNextWindowPos(pos: Readonly<ImVec2>, cond?: ImGuiCond, pivot?: Readonly<ImVec2>): void;
    export function SetNextWindowSize(pos: Readonly<ImVec2>, cond?: ImGuiCond): void;
    export enum ImGuiCond {
        None = 0,
        Always = 1,
        Once = 2,
        FirstUseEver = 4,
        Appearing = 8
    }
    export function InputTextMultiline<T>(label: string, buf: ImStringBuffer | ImAccess<string> | ImScalar<string>, buf_size?: number, size?: Readonly<ImVec2>, flags?: ImGuiInputTextFlags, callback?: ImGuiInputTextCallback<T> | null, user_data?: T | null): boolean;
    export function RadioButton(label: string, active: boolean): boolean;
    export function RadioButton(label: string, v: ImAccess<number> | ImScalar<number>, v_button: number): boolean;

    export function GetStyle(): ImGuiStyle;
    export enum ImGuiDir {
        None = -1,
        Left = 0,
        Right = 1,
        Up = 2,
        Down = 3,
        COUNT = 4
    }
    export enum ImGuiCol {
        Text = 0,
        TextDisabled = 1,
        WindowBg = 2,
        ChildBg = 3,
        PopupBg = 4,
        Border = 5,
        BorderShadow = 6,
        FrameBg = 7,
        FrameBgHovered = 8,
        FrameBgActive = 9,
        TitleBg = 10,
        TitleBgActive = 11,
        TitleBgCollapsed = 12,
        MenuBarBg = 13,
        ScrollbarBg = 14,
        ScrollbarGrab = 15,
        ScrollbarGrabHovered = 16,
        ScrollbarGrabActive = 17,
        CheckMark = 18,
        SliderGrab = 19,
        SliderGrabActive = 20,
        Button = 21,
        ButtonHovered = 22,
        ButtonActive = 23,
        Header = 24,
        HeaderHovered = 25,
        HeaderActive = 26,
        Separator = 27,
        SeparatorHovered = 28,
        SeparatorActive = 29,
        ResizeGrip = 30,
        ResizeGripHovered = 31,
        ResizeGripActive = 32,
        Tab = 33,
        TabHovered = 34,
        TabActive = 35,
        TabUnfocused = 36,
        TabUnfocusedActive = 37,
        PlotLines = 38,
        PlotLinesHovered = 39,
        PlotHistogram = 40,
        PlotHistogramHovered = 41,
        TableHeaderBg = 42,
        TableBorderStrong = 43,
        TableBorderLight = 44,
        TableRowBg = 45,
        TableRowBgAlt = 46,
        TextSelectedBg = 47,
        DragDropTarget = 48,
        NavHighlight = 49,
        NavWindowingHighlight = 50,
        NavWindowingDimBg = 51,
        ModalWindowDimBg = 52,
        COUNT = 53
    }
    export class ImGuiStyle {
        readonly internal: ImGuiStyle;
        constructor(internal?: ImGuiStyle);
        get Alpha(): number;
        set Alpha(value: number);
        get DisabledAlpha(): number;
        set DisabledAlpha(value: number);
        get WindowPadding(): ImVec2;
        get WindowRounding(): number;
        set WindowRounding(value: number);
        get WindowBorderSize(): number;
        set WindowBorderSize(value: number);
        get WindowMinSize(): ImVec2;
        get WindowTitleAlign(): ImVec2;
        get WindowMenuButtonPosition(): ImGuiDir;
        set WindowMenuButtonPosition(value: ImGuiDir);
        get ChildRounding(): number;
        set ChildRounding(value: number);
        get ChildBorderSize(): number;
        set ChildBorderSize(value: number);
        get PopupRounding(): number;
        set PopupRounding(value: number);
        get PopupBorderSize(): number;
        set PopupBorderSize(value: number);
        get FramePadding(): ImVec2;
        get FrameRounding(): number;
        set FrameRounding(value: number);
        get FrameBorderSize(): number;
        set FrameBorderSize(value: number);
        get ItemSpacing(): ImVec2;
        get ItemInnerSpacing(): ImVec2;
        get CellPadding(): ImVec2;
        get TouchExtraPadding(): ImVec2;
        get IndentSpacing(): number;
        set IndentSpacing(value: number);
        get ColumnsMinSpacing(): number;
        set ColumnsMinSpacing(value: number);
        get ScrollbarSize(): number;
        set ScrollbarSize(value: number);
        get ScrollbarRounding(): number;
        set ScrollbarRounding(value: number);
        get GrabMinSize(): number;
        set GrabMinSize(value: number);
        get GrabRounding(): number;
        set GrabRounding(value: number);
        get LogSliderDeadzone(): number;
        set LogSliderDeadzone(value: number);
        get TabRounding(): number;
        set TabRounding(value: number);
        get TabBorderSize(): number;
        set TabBorderSize(value: number);
        get TabMinWidthForCloseButton(): number;
        set TabMinWidthForCloseButton(value: number);
        get ColorButtonPosition(): number;
        set ColorButtonPosition(value: number);
        get ButtonTextAlign(): ImVec2;
        get SelectableTextAlign(): ImVec2;
        get DisplayWindowPadding(): ImVec2;
        get DisplaySafeAreaPadding(): ImVec2;
        get MouseCursorScale(): number;
        set MouseCursorScale(value: number);
        get AntiAliasedLines(): boolean;
        set AntiAliasedLines(value: boolean);
        get AntiAliasedLinesUseTex(): boolean;
        set AntiAliasedLinesUseTex(value: boolean);
        get AntiAliasedFill(): boolean;
        set AntiAliasedFill(value: boolean);
        get CurveTessellationTol(): number;
        set CurveTessellationTol(value: number);
        get CircleTessellationMaxError(): number;
        set CircleTessellationMaxError(value: number);
        Colors: ImVec4[];
        Copy(other: Readonly<ImGuiStyle>): this;
        ScaleAllSizes(scale_factor: number): void;
    }

}