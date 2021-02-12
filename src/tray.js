const path = require('path');
const { Tray, Menu } = require('electron');

let tray;

exports.create = (app, mainWindow) => {
    tray = new Tray(path.join(__dirname, '../static/icons/kiwiirclogo_512x512.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show/Hide Window',
            click: () => {
                mainWindow.isVisible()
                    ? mainWindow.hide()
                    : mainWindow.show();
            },
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            },
        },
    ]);

    tray.on('click', () => {
        mainWindow.isVisible()
            ? mainWindow.hide()
            : mainWindow.show();
    });

    tray.setToolTip('KiwiIRC');
    tray.setContextMenu(contextMenu);
};

exports.destroy = () => {
    if (!tray) {
        return;
    }
    tray.destroy();
    tray = undefined;
};
