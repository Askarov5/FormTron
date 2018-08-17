const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

//File System
const fs = require('fs');

var mainWindow;
//Listen for app to be ready
app.on('ready', function() {
    //Create new window
    mainWindow = new BrowserWindow({});
    //Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

//Handle open Windows
function openWindow(folderName, fileName) {
    //Create new window
    let win = new BrowserWindow({
        width: 800,
        height: 500,
        parent: mainWindow
    });

    //Load html into window
    win.loadURL(`file://${__dirname}/${folderName}/${fileName}.html`)
    
    /*win.loadURL(url.format({
        pathname: path.join(__dirname, 'newForm/newWindow.html'),
        protocol: 'file:',
        slashes: true
    }));*/

    //Garbage Collection - Close window when closes main window
    win.on('closed', () => {win = null;});

    win.on('resize', () => {});
    
}

//Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Form',
                click() {
                    openWindow('newForm','newWindow');
                }
            },
            {
                label: 'Open',
                click() {
                    openFile();
                }
            },
            {
                label: 'JSON',
                submenu: [
                    {
                        label: 'Paste JSON data',
                        click() {
                            openWindow('renderWindow','renderWindow');
                        }
                    },
                    {
                        label: 'Open JSON File',
                        click() {
                            openJSON();
                        }
                    }
                ]
            },
            {
                label: 'Save'
            },
            {
                label: 'Save as'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];



//open Folder
function openFile() {
    dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
}

/* 
    Extra 
            */
//IF mac, add empty objext to menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    })
}



