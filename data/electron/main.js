'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const ipcMain = require('electron').ipcMain;
const Menu = require('electron').Menu;
const Tray = require('electron').Tray;

var debugMode;
var startupFilePath;
var trayIcon = null;


//handling start parameter
//console.log(JSON.stringify(process.argv));
process.argv.forEach(function(arg, count) {
  if (arg.toLowerCase() === '-d' || arg.toLowerCase() === '--debug') {
    debugMode = true;
  } else if (arg.toLowerCase() === '-p' || arg.toLowerCase() === '--portable') {
    app.setPath('userData', 'tsprofile'); // making the app portable
  } else if (arg === '.' || count === 0) { // ignoring the first argument
    //Ignore these argument
  } else if (arg.length > 2) {
    console.log("Opening file: " + arg);
    startupFilePath = arg;
  }
});

ipcMain.on('quit-application', function(event, arg) {
  //console.log(arg);
  app.quit();
});

var path = require('path');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform != 'darwin') {
  app.quit();
  //}
});

app.on('ready', function(event) {
  console.log(event);
  mainWindow = new BrowserWindow({width: 1280, height: 768});

  //var indexPath = 'file://' + __dirname + '/index.html';
  var startupParameter = "";
  if (startupFilePath) {
    startupParameter = "?open=" + encodeURIComponent(startupFilePath);
  }
  var indexPath = 'file://' + path.dirname(__dirname) + '/index.html' + startupParameter;

  mainWindow.setMenu(null);
  mainWindow.loadURL(indexPath);

  if (debugMode) {
    mainWindow.webContents.openDevTools();
  }

  var webContents = mainWindow.webContents;

  webContents.on('crash', function() {
    console.log("WebContent crashed");
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.hide();
  });

  if (process.platform == 'darwin') {
    trayIcon = new Tray('assets/icon32.png');
  } else if(process.platform == 'win') {
    trayIcon = new Tray('assets/icon32.png');
  } else {
    trayIcon = new Tray('assets/icon32.png');
  }
  var trayMenuTemplate = [
    {
      label: 'Show App', click:  function(){
        mainWindow.show();
      }
    },
    {
      label: 'New File', click:  function(){
        mainWindow.show();
      }
    },
    {
      label: 'Previous File', click:  function(){
        mainWindow.show();
      }
    },
    {
      label: 'Stop Playback', click:  function(){
        mainWindow.show();
      }
    },
    {
      label: 'Resume Playback', click:  function(){
        mainWindow.show();
      }
    },
    //{
    //  label: 'Settings',
    //  click: function () {
    //    ipcRenderer.send('open-settings-window');
    //  }
    //},
    {
      label: 'Quit',
      click: function (event) {
        console.log(event);
        app.quit();
        //event.ipcRenderer.send('remove-tray');
        //ipcRenderer.send('window-all-closed');
      }
    }
  ];

  trayIcon.on('clicked', function() {
    mainWindow.show();
  });

  var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
  trayIcon.setToolTip('TagSpaces App');
  trayIcon.setContextMenu(trayMenu);
});
