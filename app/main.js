"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const fs = require("fs");
let win = null;
const args = process.argv.slice(1), serve = args.some(val => val === '--serve');
let progress = 0.01;
let progressInterval = 0;
let hwndFilePathIcon = path.join(path.dirname(electron_1.app.getPath("exe")), "../../build/icon.png");
const menuTemplate = [
    {
        label: 'קובץ',
        submenu: [
            {
                label: 'כניסה למערכת',
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Command + U';
                    }
                    else
                        return 'Ctrl + U';
                })(),
                click() {
                    console.log("click - User List");
                    win === null || win === void 0 ? void 0 : win.webContents.send('userList', '');
                }
            },
            {
                label: 'יציאה',
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Command + Q';
                    }
                    else
                        return 'Ctrl + Q';
                })(),
                click() {
                    console.log("click - Quit");
                    electron_1.app.quit();
                }
            }
        ]
    }
];
function createWindow() {
    const size = electron_1.screen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        icon: hwndFilePathIcon,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve),
            contextIsolation: false,
        },
    });
    const mainMenu = electron_1.Menu.buildFromTemplate(menuTemplate);
    electron_1.Menu.setApplicationMenu(mainMenu);
    if (serve) {
        const debug = require('electron-debug');
        debug();
        require('electron-reloader')(module);
        win.loadURL('http://localhost:4200');
    }
    else {
        // Path when running electron executable
        let pathIndex = './index.html';
        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
            // Path when running electron in local folder
            pathIndex = '../dist/index.html';
        }
        let hwnd = win.getNativeWindowHandle();
        let hwndString = hwnd.readUInt32LE(0).toString(10); // this works only for 32 WPF process and 32 bit Electron process
        console.log("hwndFilePath");
        // write the hwnd so that the parent process can use it
        let hwndFilePath = path.join(path.dirname(electron_1.app.getPath("exe")), "../hwnd.txt");
        fs.writeFileSync(hwndFilePath, hwndString);
        progressInterval = setInterval(() => {
            win === null || win === void 0 ? void 0 : win.setProgressBar(progress);
            if (progress <= 1) {
                progress += 0.01;
            }
            else {
                win === null || win === void 0 ? void 0 : win.setProgressBar(-1);
                clearInterval(progressInterval);
            }
        }, 75);
        const url = new URL("https://shilmanlior2608.ddns.net:8433/LsFinanceAdvisor/UsersList");
        win.loadURL(url.href);
        //win.setOverlayIcon(nativeImage.createFromPath(hwndFilePathIcon), 'LS Finance Advisor')
        win.webContents.openDevTools();
    }
    electron_1.ipcMain.on('update-win', (event, title) => {
        const webContents = event.sender;
        const win = electron_1.BrowserWindow.fromWebContents(webContents);
        //win?.setTitle(title)
        console.log("update-win");
    });
    if (process.platform === 'darwin') {
        menuTemplate.unshift({
            label: 'Default',
            submenu: []
        });
    }
    /* if (process.env.NODE_ENV !== 'production') {
      menuTemplate.push({
        label: 'View',
        submenu: [
          { role: 'reload' },
          {
            label: 'Toggle Developer Tools',
            accelerator: (() => {
              if (process.platform === 'darwin') {
                return 'Command+Alt+I';
              }
              else
                return 'Ctrl+Shift+I';
            })(),
            click(item, focusedWindow) {
              focusedWindow.toggleDevTools()
            }
          }
        ]
      })
    } */
    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    win === null || win === void 0 ? void 0 : win.once('ready-to-show', () => {
        win === null || win === void 0 ? void 0 : win.setProgressBar(-1);
        clearInterval(progressInterval);
        win === null || win === void 0 ? void 0 : win.maximize();
    });
    return win;
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', () => setTimeout(createWindow, 400));
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map