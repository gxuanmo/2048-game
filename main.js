const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * 创建主窗口
 */
function createWindow() {
    // 创建浏览器窗口
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        icon: path.join(__dirname, 'icon.ico'), // 应用图标
        title: '2048游戏',
        resizable: true, // 允许调整窗口大小
        maximizable: true // 允许最大化
    });

    // 加载应用的 index.html
    mainWindow.loadFile('index.html');

    // 在开发模式下打开开发者工具
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    // 移除菜单栏
    mainWindow.setMenuBarVisibility(false);
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
        // 通常在应用程序中重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// 当所有窗口都关闭时退出应用
app.on('window-all-closed', function () {
    // 在 macOS 上，应用程序和它们的菜单栏通常保持活动状态，
    // 直到用户使用 Cmd + Q 明确退出
    if (process.platform !== 'darwin') app.quit();
});

// 在此文件中，你可以包含应用程序剩余的所有主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。