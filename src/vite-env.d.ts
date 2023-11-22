/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MANIFEST_PATH: string;
  readonly VITE_APP_TWA_URL: `${string}://${string}`;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
