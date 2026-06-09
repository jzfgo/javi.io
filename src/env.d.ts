/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CV_HASH: string;
  readonly PUBLIC_CV_UPDATED: string;
}

interface Window {
  themeInitialized?: boolean;
  gtmInitialized?: boolean;
  dataLayer?: Record<string, unknown>[];
  appInitialized?: boolean;
}

