/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TAURI_DEV_HOST: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}