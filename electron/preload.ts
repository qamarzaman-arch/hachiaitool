import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('hachiaiDesktop', {
  getPlatform: () => ipcRenderer.invoke('app:get-platform') as Promise<string>,
  getVersion: () => ipcRenderer.invoke('app:get-version') as Promise<string>,
});
