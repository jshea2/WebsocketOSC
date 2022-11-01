/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
const fs = require('fs')
const { Client, Server } = require('node-osc');
const express = require('express')
const app2 = express()
const server = require('http').createServer(app2)
const WebSocket = require('ws')





// export default class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

let mainWindow: BrowserWindow | null = null;

// ipcMain.on('ipc-example', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// const isDevelopment =
//   process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// if (isDevelopment) {
//   require('electron-debug')();
// }

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     )
//     .catch(console.log);
// };

const windowWidth = 160;
const windowHeight = 537;

const createWindow = async () => {
  // if (isDevelopment) {
  //   await installExtensions();
  // }

  // ipcMain.on('ping', (event, arg) => {
  //   console.log(arg)
  //   mainWindow.webContents.send('test', "HIIIIIII")
  // })

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: windowWidth,
    height: windowHeight,
    autoHideMenuBar: true,
    backgroundColor: '#081421', // background color
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
 // new AppUpdater();

  let oscIpIn
  let oscPortIn
  let oscIpOut
  let oscPortOut
  let watchoutIpOut
  let watchoutPortOut
  let oscInEnabled
  let oscOutEnabled


  // Log to Browser Console
  function logEverywhere(message) {
    if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log(\`${message}\`)`);
    }
    }

// Path To Data
  const dataPath =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../data')
    : path.join(process.resourcesPath, 'data');

  //Read data from config.JSON file and handle data to renderer
  const getConfig = () => {
    const path1 = path.join(dataPath, 'config.json')
    fs.readFile(path1, null, (_, data) => {
      const jsonData = JSON.parse(data)
      oscIpIn = jsonData.iposc
      oscPortIn = jsonData.portosc
      oscIpOut = jsonData.iposcout
      oscPortOut = jsonData.portoscout
      watchoutIpOut = jsonData.ipwatchout
      watchoutPortOut = jsonData.portwatchout
      oscInEnabled = jsonData.oscinenabled
      oscOutEnabled = jsonData.oscoutenabled
      console.log(`i got the config file:`)
      console.log(jsonData)
      ipcMain.handle('configDefaults', async (_,message) => {
        return jsonData
      })
    })
  }
  getConfig()

// Write data to config.JSON file
  const saveData = (config) => {
    const finished = (error) => {
      if(error){
        console.log(error);
        return;
      }
    }
    const jsonData = JSON.stringify(config, null, 2)
    fs.writeFile(path.join(dataPath, 'config.json'), jsonData, finished);
    console.log("saved file")
  }


  //Submit and Config Handle
  ipcMain.handle('config', async (_, message) => {
    if(message.portwatchout == 8000){
      mainWindow.setSize((windowWidth*2+100),windowHeight)
      mainWindow.webContents.openDevTools();
      logEverywhere("Websocket Port ERROR: This app is already using port 8000")
      logEverywhere("Please choose a different Port number")
      mainWindow.webContents.send("woconnected", false)
      return
    }
    console.log(message)
    saveData(message)
    oscIpIn = message.iposc
    oscPortIn = message.portosc
    oscIpOut = message.iposcout
    oscPortOut = message.portoscout
    watchoutIpOut = message.ipwatchout
    watchoutPortOut = message.portwatchout
    oscInEnabled = message.oscinenabled
    oscOutEnabled = message.oscoutenabled
    mainWindow.setSize((windowWidth*2+100),windowHeight)
    mainWindow.webContents.openDevTools();
    //logEverywhere("")


    // WEBSOCKET and EXPRESS
    const wss = new WebSocket.Server({server:server})
    const ws = new WebSocket(`ws://${watchoutIpOut}:${watchoutPortOut}`, {
      perMessageDeflate: false
    });


    wss.on('connection', function connection(ws) {
      logEverywhere(`New Connection`)
      console.log("connected to server")
      mainWindow.webContents.send("woconnected", true)

      if (oscInEnabled){
        oscServer.on('message', function (msg) {

          console.log(`OSC Message: ${msg}`)
          logEverywhere(`OSC Message: ${msg}`)
          // let obj = {
          //   v:[msg[1]],
          //   a: msg[0]
          // }
          ws.send(JSON.stringify(msg));
        })

        oscServer.on('bundle', function (bundle) {
          console.log(bundle)
          ws.send(JSON.stringify(bundle));
          bundle.elements.forEach((element, i) => {
            // console.log(`Timestamp: ${bundle.timetag[i]}`);
            logEverywhere(`Bundle OSC Message: ${element}`);
          });
          //oscServer.close();
        });
      }

      if (oscOutEnabled){
        ws.on('message', function message(data) {
          console.log("This is the Websocket Data:")
          console.log(data.toString());
          let wsoscmessage = JSON.parse(data.toString())
          //oscClient.send(wsoscmessage.a, wsoscmessage.v)
          console.log(wsoscmessage)
          oscClient.send(wsoscmessage)
        });
      }


      ws.on('message', function message(data) {
        wss.clients.forEach(client => {
          client.send(data.toString())
        })
        logEverywhere(`Websocket Data: `)
        logEverywhere(data.toString())
      })

      //ws.close()

    })

    app2.get('/', (req,res) => res.send("Hello World!"))

    server.listen(watchoutPortOut, () => {
      console.log(`Listening on port :${watchoutPortOut}`)
      logEverywhere(`Websocket Connected on Port :${watchoutPortOut}`)
    })







    if (oscInEnabled){
          //Connect OSC
    var oscServer = new Server(oscPortIn, oscIpIn, () => {
      console.log('OSC Server is listening');
      console.log(`OSC IP: ${oscIpIn}\n OSC Port: ${oscPortIn}`)

    });

    }

    if (oscOutEnabled){
      var oscClient = new Client(oscIpOut, oscPortOut, () => {
        console.log('OSC Client is listening');
        console.log(`OSC Out IP: ${oscIpOut}\n OSC Port: ${oscPortOut}`)
      })
    }



    //

    return
  })

  ipcMain.handle('consoleWindow', async (_, message) => {
    console.log("I GOT THE ARROW THING")
    console.log(message)
    if (message == false){
      mainWindow.webContents.openDevTools()
      mainWindow.setSize(windowWidth*2+100,windowHeight)
    } else if (message == true){
      mainWindow.webContents.closeDevTools()
      mainWindow.setSize(windowWidth,windowHeight)
    }
    return "Hi there"
  })

};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
