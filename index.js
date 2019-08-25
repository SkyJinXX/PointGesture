const ioHook = require('iohook');
const doAction = require('./action');
const EventRegister = require('./event/EventRegister');


// regist listener
const register = new EventRegister(ioHook);
register.regist('holdMouseRBtnMove', (e) => {
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
// addEventListener(ioHook, 'holdMouseRBtnMove', (e) => {
//   switch (e.moveDirection) {
//     case 'up':
//       doAction('taskView');
//       break;
//     case 'down':
//       doAction('taskView');
//       break;
//     case 'left':
//       doAction('desktopRight');
//       break;
//     case 'right':
//       doAction('desktopLeft');
//       break;
//     default:
//       break;
//   }
// })

// start Listen
ioHook.start(false);