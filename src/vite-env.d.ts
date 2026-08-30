/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEDIA_CDN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
