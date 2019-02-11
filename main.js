const electron = require('electron');
const { ipcMain } = require('electron')
const fs = require('fs')

const currentBuildOption = require('./config').getOption()

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

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
        mainWindow.send('logs', {type: 'stdout', msg: d })
    }
})

console.error = (function(d){
    process.stderr.write(d + '\n')
    errorLog.write(d + '\n')
})

console.log(`Programs Starts: ${new Date()}`)

/*ipcMain.on('google', (event, query, index) => {
    console.log(`query = ${query}, index = ${index}`)

    googleScholar.googleScholar(query, index).then(res => {
        res.resultPath = __dirname + '\\' + res.resultPath.replace(/\//g,'\\')
        event.sender.send('googleDone', {
            stat: true,
            msg: res
        })
    }).catch( e => {
        event.sender.send('googleDone',{
            stat: false,
            msg: e
        })
    })
})*/

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800, 
        height: 800, 
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