const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  addLogoToImage: (data) => {
    ipcRenderer.invoke('addLogoToImage', data);
  },
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
});
