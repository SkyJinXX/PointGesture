const {app, Menu, Tray} = require('electron');
const path = require('path')
const PointGesture = require('./PointGesture')

app.on('ready', () => {
    const pointGesture = new PointGesture()
    // const iconUrl = process.env.NODE_ENV === 'development' ? path.join(__dirname, './assets/images/P.ico') : path.join(__dirname, 'static/favicon.ico')
    const tray = new Tray(path.join(__dirname,'./assets/images/P.ico'));
    const menuTemplate = [
        {
            id: 'toggle',
            label: '暂停',
            click: function () {
                pointGesture.isActive ? pointGesture.pause() : pointGesture.active();
                menuTemplate[0].label = pointGesture.isActive ? '暂停' : '激活';
                tray.setContextMenu(Menu.buildFromTemplate(menuTemplate))
            }
        },
        {
            label: '退出',
            click: function(){
                pointGesture.stop();
                app.quit();
            }
        }
    ]
    
    tray.setToolTip('PointGesture');
    tray.setContextMenu(Menu.buildFromTemplate(menuTemplate));
    pointGesture.start();
})