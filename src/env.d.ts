/// <reference types="astro/client" />

interface Window {
  /** Sets the visitor's theme choice and what is on screen (BaseLayout's inline script). */
  applyTheme(theme: 'light' | 'dark' | 'system'): void;
}
