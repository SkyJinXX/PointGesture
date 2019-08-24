const ioHook = require('iohook');
const doAction = require('./action');
const addEventListener = require('./event');


// registe listener
addEventListener(ioHook, 'holdMouseRBtnMove', (e) => {
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