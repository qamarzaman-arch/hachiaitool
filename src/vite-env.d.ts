/// <reference types="vite/client" />

declare global {
  interface Window {
    hachiaiDesktop?: {
      getPlatform: () => Promise<string>;
      getVersion: () => Promise<string>;
    };
  }
}

export {};
