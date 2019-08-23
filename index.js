const ioHook = require('iohook');
const doAction = require('./action');
const addEventListener = require('./event');


// registe listener
const desktopRight = ioHook.registerShortcut([29, 3675, 61005], (keys) => {
    console.log('桌面向右')
  });
addEventListener(ioHook, 'mouseButtonRight', (e) => {
  switch (e.moveDirection) {
    case 'up':
      doAction('taskView');
      break;
    case 'down':
      doAction('taskView');
      break;
    case 'left':
      doAction('desktopRight');
      break;
    case 'right':
      doAction('desktopLeft');
      break;
    default:
      break;
  }
})


// start Listen
ioHook.start(false);