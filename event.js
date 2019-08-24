const robot = require('robotjs');
const getMoveDirection = require('./util/getMoveDirection');

const events = new Map([
    ['holdMouseRBtnMove', (ioHook, handler) => {
        let downMode = false;
        let start = { x: -1, y: -1 };
        let current = { x: -1, y: -1 };
        let letItGo = false;

        // down && up
        ioHook.on('mousedown', event => {
            // console.log(event); 
            if (event.button === 2) {
                if (letItGo) return;

                ioHook.disableClickPropagation();// 禁用鼠标点击功能
                downMode = true;// 开启按下模式
            }
        });
        ioHook.on('mouseup', event => { 
            // console.log(event); 
            if (event.button === 2) {
                if (letItGo) { letItGo = false; return; }

                ioHook.enableClickPropagation();// 恢复鼠标点击功能
                downMode = false;// 关闭按下模式
                // 重置位置变量
                start.x = start.y = -1;
                current.x = current.y = -1;

                // 未移动鼠标时，触发真正的右键
                if (start.x === -1 && start.y === -1) {
                    letItGo = true;
                    robot.mouseClick('right');
                }
            }
        });

        // 鼠标移动判断
        ioHook.on('mousedrag', event => {

            // console.log(event);
            if (downMode) {// 如果是按下的状态
                if (start.x === -1 && start.y === -1) {// 获取初始值
                    start.x = event.x;
                    start.y = event.y;
                    return;
                } else {// 获取当前值
                    current.x = event.x;
                    current.y = event.y;
                }
                let moveDirection = getMoveDirection(start, current);

                if (moveDirection) {
                    handler({ moveDirection });
                    downMode = false;
                }
            }
        })
    }]
])
const addEventListener = (ioHook, event, handler) => {
    events.get(event)(ioHook, handler);
}


module.exports = addEventListener;