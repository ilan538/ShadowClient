const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');
const os = require('os');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    transparent: false,
    backgroundColor: '#0a0a0f',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets', 'icon.ico')
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Window controls
ipcMain.on('minimize-window', () => mainWindow.minimize());
ipcMain.on('maximize-window', () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on('close-window', () => mainWindow.close());

// Modrinth API search
ipcMain.handle('search-mods', async (event, query, version, loader) => {
  return new Promise((resolve, reject) => {
    let facets = [['project_type:mod']];
    if (version) facets.push([`versions:${version}`]);
    if (loader) facets.push([`categories:${loader}`]);

    const facetsStr = encodeURIComponent(JSON.stringify(facets));
    const url = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(query)}&facets=${facetsStr}&limit=20`;

    https.get(url, {
      headers: { 'User-Agent': 'ShadowClient/1.0.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
});

// Get mod versions
ipcMain.handle('get-mod-versions', async (event, projectId) => {
  return new Promise((resolve, reject) => {
    const url = `https://api.modrinth.com/v2/project/${projectId}/version`;
    https.get(url, {
      headers: { 'User-Agent': 'ShadowClient/1.0.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
});

// Download mod
ipcMain.handle('download-mod', async (event, downloadUrl, fileName) => {
  const modsDir = path.join(os.homedir(), 'AppData', 'Roaming', '.minecraft', 'mods');
  if (!fs.existsSync(modsDir)) fs.mkdirSync(modsDir, { recursive: true });

  const filePath = path.join(modsDir, fileName);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(downloadUrl, { headers: { 'User-Agent': 'ShadowClient/1.0.0' } }, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({ success: true, path: filePath });
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
});

// Open mods folder
ipcMain.on('open-mods-folder', () => {
  const modsDir = path.join(os.homedir(), 'AppData', 'Roaming', '.minecraft', 'mods');
  if (!fs.existsSync(modsDir)) fs.mkdirSync(modsDir, { recursive: true });
  shell.openPath(modsDir);
});
