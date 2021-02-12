'use strict';

const path = require('path');
const {
    app,
    shell,
    protocol,
    globalShortcut,
    BrowserWindow,
    Menu,
} = require('electron');

const contextMenu = require('electron-context-menu');
contextMenu();

const tray = require('./tray');

// Note: Must match `build.appId` in electron-builder.json
app.setAppUserModelId('com.kiwiirc.desktop');

// Prevent window from being garbage collected
let mainWindow;
let doQuit = false;

const createMainWindow = async () => {
    // Rewrite config.json
    protocol.interceptFileProtocol('file', (request, callback) => {
        if (request.url.endsWith('/static/config.json')) {
            callback(path.join(__dirname, '../static/config.json'));
        } else {
            callback(request.url.substr(8));
        }
    });

    const win = new BrowserWindow({
        title: app.name,
        show: false,
        width: 1280,
        height: 720,
        icon: path.join(__dirname, '../static/icons/kiwiirclogo_512x512.png'),
        webPreferences: {
            nodeIntegration: false,
            // Required to use preload to pass classes in
            // TODO: find a better/more secure way
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.on('ready-to-show', () => {
        win.show();
    });

    win.on('close', (event) => {
        if (doQuit) {
            app.quit();
            return;
        }

        event.preventDefault();
        mainWindow.hide();
    });

    win.on('closed', () => {
        // Dereference the window
        mainWindow = undefined;
    });

    win.webContents.on('before-input-event', (event, input) => {
        if (process.platform === 'darwin') {
            return;
        }
        // Alt+F4 closes the app
        if (input.code === 'F4' && input.alt && !input.shift && !input.control && !input.meta) {
            // Only works on windows
            app.quit();
        }
    });

    const isSafeForExternalOpen = (url = '') => {
        return ['http', 'https'].includes(url.split(':')[0] || '');
    };

    // Allow os to handle clicked links
    win.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        if (isSafeForExternalOpen(url)) {
            shell.openExternal(url);
        }
    });

    await win.loadFile(path.join(__dirname, '../kiwiirc/dist/index.html'));

    return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
    app.quit();
}

app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.show();
    }
});

app.on('before-quit', () => {
    doQuit = true;
});

app.on('will-quit', () => {
    if (process.platform !== 'darwin') {
        tray.destroy();
    }
});

app.on('activate', async () => {
    if (!mainWindow) {
        mainWindow = await createMainWindow();
        return;
    }
    if (!mainWindow.isVisible()) {
        mainWindow.show();
    }
});

(async () => {
    await app.whenReady();

    Menu.setApplicationMenu(null);
    mainWindow = await createMainWindow();

    if (process.platform !== 'darwin') {
        tray.create(app, mainWindow);
        globalShortcut.register('Alt+F4', () => {
            // Only works on linux
            app.quit();
        });
    }

    if (process.defaultApp) {
        // Running in dev mode
        mainWindow.webContents.openDevTools();
    }
})();
