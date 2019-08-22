const ioHook = require('iohook');
const robot = require('robotjs');

ioHook.on('keydown', event => {
  console.log(event); // { type: 'mousemove', x: 700, y: 400 }
});

const desktopRight = ioHook.registerShortcut([29, 3675, 61005], (keys) => {
    console.log('桌面向右')
  });
const desktopLeft = ioHook.registerShortcut([29, 3675, 61003], (keys) => {
    console.log('桌面向左')
  });
// Register and start hook
ioHook.start();

// Alternatively, pass true to start in DEBUG mode.
// ioHook.start(true);




robot.keyToggle('right', 'down', ['control', 'command']);
robot.keyToggle('left', 'down', ['control', 'command']);
