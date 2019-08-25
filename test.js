const ioHook = require('iohook');
const doAction = require('./action');

const keydownHandler = (e) => {
    console.log(e);
    // if (e.keycode === 57) ioHook.removeListener('keydown', keydownHandler);
}
ioHook.addListener('mousedown', keydownHandler)

ioHook.start(false);