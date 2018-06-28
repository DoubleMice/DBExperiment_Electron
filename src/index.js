import { app, BrowserWindow } from 'electron';

import { Menu, MenuItem, dialog, ipcMain } from 'electron';
// import { menuTemplate } from './menu.js';
// const path = require('path')
// const url = require('url')
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
global 
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 450,
    show: false,
    backgroundColor: '#002b36',
    // frame: false,
    titleBarStyle: 'hidden'
  });

  //menu
  const template = [
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'About Me',
          click () { require('electron').shell.openExternal('https://doublemice.github.io/aboutme') }
        }
      ]
    }
  ]
  
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  
    // Edit menu
    template[1].submenu.push(
      {type: 'separator'},
      {
        label: 'Speech',
        submenu: [
          {role: 'startspeaking'},
          {role: 'stopspeaking'}
        ]
      }
    )
  
    // Window menu
    template[3].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
  }
  
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)



  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);


  mainWindow.on('ready-to-show', function() {
    mainWindow.show();
    mainWindow.focus();
    
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);



// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {

  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


const ipc = require('electron').ipcMain;
ipc.on('subwin',function(event,subwin_name){
    let subwin = new BrowserWindow({
      width: 520, 
      height: 390,
      // frame:false,
      show: false,
      parent: mainWindow, //win是主窗口
    });
    subwin.loadURL(`file://${__dirname}/subwin/`+subwin_name+`.html`); //add.html是新开窗口的渲染进程
    // subwin.webContents.openDevTools();
    subwin.on('ready-to-show', function() {
      subwin.show();
      subwin.focus();
    });
    subwin.on('closed',()=>{subwin = null})

})



var mysql  = require('mysql');  
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123456',
    port: '3306',
    database: 'stdb',
});
connection.connect();


///////////db operation
ipc.on('submit',function (event,type,p1,p2,p3,p4,p5) {
  // type,Sno,Sname,Ssex,Sage,Sdept
  console.log(type,p1,p2,p3,p4,p5);
  var operation;
  var params = [];
  switch(type){
    case "addstudent":{
      operation = 'INSERT INTO S(Sno,Sname,Ssex,Sage,Sdept) VALUES(?,?,?,?,?)';
      params = [p1,p2,p3,p4,p5];
    };break;
    case "addcourse":{
      operation = 'INSERT INTO C(Cno,Cname,Cpno,Ccredit) VALUES(?,?,?,?)';
      params = [p1,p2,p3,p4];
    };break;
    case "addgrade":{
      operation = 'INSERT INTO SC(Sno,Cno,Grade) VALUES(?,?,?)';
      params = [p1,p2,p3];
    };break;
    case "deletestudent":{
      operation = 'DELETE FROM S WHERE Sno=?';
      params = [p1];
    };break;
    case "deletecourse":{
      operation = 'DELETE FROM C WHERE Cno=?';
      params = [p1];
    };break;
    case "deletegrade":{
      operation = 'DELETE FROM SC WHERE Sno=? AND Cno=?';
      params = [p1,p2];
    };break;
    case "updatestudent":{
      operation = 'UPDATE S SET Sdept=? WHERE Sno=?';
      params = [p2,p1];
    };break;
    case "updategrade":{
      operation = 'UPDATE SC SET Grade=? WHERE Sno=? AND Cno=?';
      params = [p3,p1,p2];
    };break;
    case "updatecourse":{
      operation = 'UPDATE C SET Ccredit=? WHERE Cno=?';
      params = [p2,p1];
    };break;

    case "findstudent":{
      operation = 'SELECT Sno,Sname,Ssex,Sdept FROM S ORDER BY Sno'; 
      params = [];
    };break;
    case "findgrade":{
      operation = '\
      SELECT SC.Sno,S.Sname,C.Cname,SC.Grade \
      FROM SC,S,C \
      WHERE S.Sno=SC.Sno\
      AND C.Cno=SC.Cno\
      ORDER BY SC.Sno';
      params = [];
    };break;
    case "findcourse":{
      operation = 'SELECT Cno,Cname,Ccredit FROM C ORDER BY Cno';
      params = [];
    };break;
    default:
      return;
  }
  connection.query(operation,params,function(err,result){
    if(err){
        event.returnValue=err;
        console.log(err)
      return;
    }
    console.log(result);
    switch(type){
      case "findstudent":
      case "findcourse":
      case "findgrade":
        event.returnValue=result;
      default :
        event.returnValue="success";
    }
  })
})