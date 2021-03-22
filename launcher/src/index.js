const { app, BrowserWindow, globalShortcut, shell } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    },
    frame : true,
    transparent : true
    
  })

  // and load the index.html of the app.
  win.loadFile('launcher.html')
}

// when app is ready register a global shortcut
// that calls createWindow function
app.on('ready', () => {
    globalShortcut.register('CommandOrControl+b', createWindow)
})

// do not quit when all windows are closed
// and continue running on background to listen
// for shortcuts
app.on('window-all-closed', (e) => {
  e.preventDefault()
  e.returnValue = false
})