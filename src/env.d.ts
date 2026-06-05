/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  themeInitialized?: boolean;
  gtmInitialized?: boolean;
  dataLayer?: Record<string, unknown>[];
  appInitialized?: boolean;
}
