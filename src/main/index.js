import { app, BrowserWindow, Tray, Menu } from 'electron'
import path from 'path';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000,
        tooltip: 'kk',
        icon: path.join(__static, './icon/icon.png')
    })
    if (process.platform === 'darwin') {
        app.dock.setIcon(`${path.join(__static, './icon/icon.png')}`);
    }

    mainWindow.loadURL(winURL)
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

let appTray;
app.on('ready', () => {
    const appMenu = [{
        label: "edit",
        submenu: [
            { label: "quit", accelerator: "Command+Q", click: function () { app.quit(); } }
        ]
    }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu));

    //系统托盘图标目录
    let trayIcon = path.join(__static, './icon/iconh.png');

    appTray = new Tray(trayIcon);

    //设置此托盘图标的悬停提示内容
    appTray.setToolTip('free host');

    //单击小图标显示应用
    appTray.on('click', function () {
        if (mainWindow === null) {
            createWindow()
        }else{
            mainWindow.show();
        }
    })

    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
