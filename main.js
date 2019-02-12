const electron = require('electron');
const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path');
const url = require('url');

const PreviewGenerator = require('./Generator')

const currentBuildOption = require('./config').getOption()



const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const accessLog = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
const errorLog = fs.createWriteStream(__dirname + '/error.log', {flags: 'a'})

let mainWindow;

// When Deployed to Electron
process.chdir(currentBuildOption.processPath)

/*if(!fs.existsSync(currentBuildOption.StoragePath)){
    fs.mkdirSync(currentBuildOption.StoragePath)
}
else{
    if(!fs.lstatSync(currentBuildOption.StoragePath).isDirectory()) {
        fs.unlinkSync(currentBuildOption.StoragePath)
        fs.mkdirSync(currentBuildOption.StoragePath)
    }    
}

if(!fs.existsSync(`${currentBuildOption.StoragePath}/Books/`)){
    fs.mkdirSync(`${currentBuildOption.StoragePath}/Books/`)
}
else {
    if(!fs.lstatSync(`${currentBuildOption.StoragePath}/Books`).isDirectory()) {
        fs.unlinkSync(`${currentBuildOption.StoragePath}/Books`)
        fs.mkdirSync(`${currentBuildOption.StoragePath}/Books`)
    }
    
}

if(!fs.existsSync(currentBuildOption.JsonPath)){
    fs.mkdirSync(currentBuildOption.JsonPath)
}
else {
    if(!fs.lstatSync(currentBuildOption.JsonPath).isDirectory()) {
        fs.unlinkSync(currentBuildOption.JsonPath)
        fs.mkdirSync(currentBuildOption.JsonPath)
    }
    
}*/

console.log = (function(d){
    process.stdout.write(d + '\n')
    accessLog.write(d + '\n')
    if(mainWindow){
        mainWindow.send('logs', {type: 'stdout', msg: d.replace(/\n/g,'<br>') })
    }
})

console.error = (function(d){
    process.stderr.write(d + '\n')
    errorLog.write(d + '\n')
    if(mainWindow){
        mainWindow.send('logs', {type: 'stdout', msg: d.replace(/\n/g,'<br>') })
    }
})

console.log(`Programs Starts: ${new Date()}`)

ipcMain.on('generate', (event, query) => {
    
    console.log(`generate query = ${query}`)
  
    if(!fs.existsSync(query)) {
        event.sender.send('generateDone',{
            stat: false,
            msg: 'Query Path Not Exist.'
        })
    }
    else {
        PreviewGenerator.GenerateAll(query).then( res => {
            event.sender.send('generateDone',{
                stat: true,
                msg: res
            })
        }).catch( e => {
            event.sender.send('generateDone',{
                stat: false,
                msg: e
            })
        })
    }
})


ipcMain.on('collection', (event, query) => {
    
    console.log(`collection query = ${query}`)
    
    if(!fs.existsSync(query)) {
        event.sender.send('collectionDone',{
            stat: false,
            msg: 'Query Path Not Exist.'
        })
    }
    else {
        PreviewGenerator.CollectAll(query).then( res => {
            event.sender.send('collectionDone',{
                stat: true,
                msg: res
            })
        }).catch( e => {
            event.sender.send('collectionDone',{
                stat: false,
                msg: e
            })
        })
    }
})


function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1000, 
        height: 1000, 
        icon: currentBuildOption.BrowserIcon, 
        resizable: currentBuildOption.isDev == true // for release version
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});