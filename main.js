'use strict';
const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

//Import Electron Modules
const {app, BrowserWindow, Menu} = electron;
const remote = require('electron').remote;

//live reload(DevDep) 
require('electron-reload')(__dirname);

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
function openWindow(folderName, fileName, max) {
    //Create new window
    let win = new BrowserWindow({
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        transparent: true,
        width: 800,
        height: 500,
        parent: mainWindow
    });

    //open new screen in max size
    if(max == true) {
        win.maximize();
    }

    //Load html into window
    win.loadURL(`file://${__dirname}/${folderName}/${fileName}.html`)
    
    /*win.loadURL(url.format({
        pathname: path.join(__dirname, 'newForm/newWindow.html'),
        protocol: 'file:',
        slashes: true
    }));*/

    //Garbage Collection - Close window when closes main window
    win.on('closed', () => {win = null;});

    //Catch window resize
    win.on('resize', () => {});
    
}

//Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Form',
                submenu: [
                        {
                            label: 'jQuery Form',
                            click() {
                                openWindow('newForm','newWindow', true);
                            }
                        },
                        {
                            label: 'Bootstrap 3 Form',
                            click() {
                                openWindow('bootForm','bootForm', true);
                            }
                        }                  
                  ]      
            },
            {
                label: 'Render',
                click() {
                    openWindow('renderWindow', 'renderWindow');
                }
            },
            {type: 'separator'},
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