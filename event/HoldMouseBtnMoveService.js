const robot = require('robotjs');
const getMoveDirection = require('../util/getMoveDirection');

const mousedown = 'mousedown';
const mouseup = 'mouseup';
const mousedrag = 'mousedrag';
const rightBtn = 2;
const leftBtn = 1;
const middleBtn = 3;
const btn2RobotBtn = {
    [rightBtn]: 'right',
    [middleBtn]: 'middle',
    [leftBtn]: 'left'
}

class HoldMouseBtnMoveService {
    constructor (ioHook) {
        this.ioHook = ioHook;
        this.buttonHandler = new Map();
        this.listenerMap = new Map();
        this.downButton = 0;
        this.startPos = { x: -1, y: -1 };
        this.currentPos = { x: -1, y: -1 };
        this.letItGo = false;

        this._initListenerMap();
        this.start();
    }

    _initListenerMap () {
        const listenerMap = this.listenerMap;
        let { startPos, currentPos, ioHook, downButton, letItGo, buttonHandler } = this;

        listenerMap.set(mousedown, event => {
            console.log(event); 
            if (letItGo) return;

            downButton = event.button;// 记录按下的button
        })
        listenerMap.set(mouseup, event => { 
            // console.log(event); 
            if (letItGo) { letItGo = false; return; }
            // 未移动鼠标时，触发真正的单击
            if (startPos.x === -1 && startPos.y === -1) {
                letItGo = true;
                ioHook.enableClickPropagation();
                robot.mouseClick(btn2RobotBtn[downButton]);
                ioHook.disableClickPropagation();
            }

            downButton = 0;// 清除按下的button
            // 重置位置变量
            startPos.x = startPos.y = -1;
            currentPos.x = currentPos.y = -1;
        })
        listenerMap.set(mousedrag, event => {

            console.log(event);
            if (buttonHandler.has(downButton)) {// 如果按钮被注册过了
                if (startPos.x === -1 && startPos.y === -1) {// 获取初始值
                    startPos.x = event.x;
                    startPos.y = event.y;
                    return;
                } else {// 获取当前值
                    currentPos.x = event.x;
                    currentPos.y = event.y;
                }
                let moveDirection = getMoveDirection(startPos, currentPos);

                if (moveDirection) {
                    console.log(typeof buttonHandler.get(downButton))
                    buttonHandler.get(downButton)({ moveDirection });
                    downButton = 0;
                }
            }
        })
    }

    add (btnType, handler) {
        this.buttonHandler.set(btnType, handler);

        this.ioHook.disableClickPropagation();
    }

    remove (btnType, handler) {
        // 移除button从buttonHandler
        // 如果uttonHandler空了，就不禁用鼠标点击了
    }

    start () {
        let { ioHook, listenerMap } = this;

        for (let [key, value] of listenerMap.entries()) {
            ioHook.addListener(key, value);
        }
    }

    stop () {
        let { ioHook, listenerMap } = this;

        for (let [key, value] of listenerMap.entries()) {
            ioHook.removeListener(key, value);
        }
    }
}

module.exports = HoldMouseBtnMoveService;