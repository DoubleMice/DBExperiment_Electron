# DBExperiment_Electron
数据库原理课设 with electron@NUAA 2018
<!-- TOC -->

- [DBExperiment_Electron](#dbexperiment_electron)
    - [Install](#install)
    - [Develope](#develope)
        - [自定义菜单](#自定义菜单)
        - [主线程中ipcMain](#主线程中ipcmain)
        - [子线程ipcRenderer](#子线程ipcrenderer)
    - [Snopshot](#snopshot)

<!-- /TOC -->
## Install
```sh
# mysql client
# user:root
# password:root123456
$ git clone https://github.com/DoubleMice/DBExperiment_Electron.git
$ cd DBExperiment_Electron
$ mysql -u root -p
$ password: root123456
$ mysql source dbExp.mysql
$ npm install
$ npm start
```

## Develope

### 自定义菜单
```javascript
import {Menu} from 'electron';
...
...
const menuTemplate = [
    {
        lable : "lable1",
        submenu : [
            {role : "role1"},
            {role : "role2"}
            ...
        ]
    },
    ...
    {
        lable : "lablen",
        submenu : [
            {role : "role1"},
            ...
            {role : "rolen"}
        ]
    }
]

if (process.platform === 'darwin') {
    ...
    //定义osx上的菜单
}

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
```


### 主线程中ipcMain
index.js 主线程
ipc监听，打开子窗口
```javascript
import { ipcMain } from 'electron';
...
...
const ipc = require('electron').ipcMain;
ipc.on('subwin',function(event,subwin_name){
    let subwin = new BrowserWindow({
      width: 520, 
      height: 390,
      // frame:false,
      titleBarStyle: 'hidden',
      show: false,
      parent: mainWindow, //主窗口
    });
    subwin.loadURL(`file://${__dirname}/subwin/`+subwin_name+`.html`);
    // subwin.webContents.openDevTools();
    subwin.on('ready-to-show', function() {
      subwin.show();
      subwin.focus();
    });
    subwin.on('closed',()=>{subwin = null})

})
```

### 子线程ipcRenderer
./subwin/[operation].js
子线程发送ipc信号至主线程
```javascript
    const submit = document.querySelector("#submit");
    const ipc = require('electron').ipcRenderer;
    console.log(submit);
    submit.onclick=()=>
    {
        var Cno = document.getElementById("Cno").value;
        var Sno = document.getElementById("Sno").value;
        var Grade = document.getElementById("Grade").value;
        var result = ipc.sendSync("submit","addgrade",Sno,Cno,Grade);
        //同步发送ipc信号，阻塞等待ipcMain接受并处理信号
        //result赋值为ipcMain的event.returnValue
    }
```
## Snopshot
![](./assets/snapshot.png)
