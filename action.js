const robot = require('robotjs');

const actions = new Map([
    ['desktopLeft', () => {
        robot.keyToggle('left', 'down', ['control', 'command'])
        robot.keyToggle('left', 'up', ['control', 'command'])
    }],
    ['desktopRight', () => {
        robot.keyToggle('right', 'down', ['control', 'command'])
        robot.keyToggle('right', 'up', ['control', 'command'])
    }],
    ['taskView', () => {
        robot.keyToggle('tab', 'down', ['command'])
        robot.keyToggle('tab', 'up', ['command'])
    }],
])

const doAction = type => {
    actions.get(type)();
    console.log(type);
}

module.exports = doAction;