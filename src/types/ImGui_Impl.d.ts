
declare namespace ImGui_Impl {
    export function Init(canvas: HTMLCanvasElement): void;
    export function RenderDrawData(e: any): void;
    export function NewFrame(time: number): void;
    export function Shutdown(): void;
}