const robot = require('robotjs');
const getMoveDirection = require('../util/getMoveDirection');

const mousedown = 'mousedown';
const mouseup = 'mouseup';
const mousedrag = 'mousedrag';
const mousemove = 'mousemove';
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
        this.lastPos = {x: -1, y: -1};
        this.letItGo = false;
        this.lastMoveDirection = null

        this._initListenerMap();
        this.start();
    }

    _initListenerMap () {
        const listenerMap = this.listenerMap;
        let { startPos, currentPos, lastPos ,letItGo, buttonHandler } = this;

        listenerMap.set(mousedown, event => {
            // console.log(event); 
            if (letItGo) return;

            this.downButton = event.button;// 记录按下的button
        })
        listenerMap.set(mouseup, event => { 
            // console.log(event); 
            if (letItGo) { letItGo = false; return; }
            // 未移动鼠标时，触发真正的单击
            // if (startPos.x === -1 && startPos.y === -1) {
            //     letItGo = true;
            //     ioHook.enableClickPropagation();
            //     robot.mouseClick(btn2RobotBtn[downButton]);
            //     ioHook.disableClickPropagation();
            // }

            this._reset('full')
        })
        listenerMap.set(mousedrag, event => {
            // console.log(event);

            if (buttonHandler.has(this.downButton)) {// 如果按钮被注册过了
                if (this.lastMoveDirection) {
                    if (lastPos.x === -1 && lastPos.y === -1) {
                        lastPos.x = event.x;
                        lastPos.y = event.y;
                        return
                    }
                    
                    currentPos.x = event.x;
                    currentPos.y = event.y;
                    if (startPos.x === -1 && startPos.y === -1) {
                        switch(this.lastMoveDirection) {
                            case 'up':
                                if (currentPos.y > lastPos.y) {
                                    startPos.x = event.x;
                                    startPos.y = event.y;
                                }
                                break;
                            case 'down':
                                if (currentPos.y < lastPos.y) {
                                    startPos.x = event.x;
                                    startPos.y = event.y;
                                }
                                break;
                            case 'left':
                                if (currentPos.x > lastPos.x) {
                                    startPos.x = event.x;
                                    startPos.y = event.y;
                                }
                                break;
                            case 'right':
                                if (currentPos.x < lastPos.x) {
                                    startPos.x = event.x;
                                    startPos.y = event.y;
                                }
                                break;
                        }
                        lastPos.x = currentPos.x
                        lastPos.y = currentPos.y

                        return
                    }
                    let moveDirection = getMoveDirection(startPos, currentPos, this.lastMoveDirection);

                    if (moveDirection) {
                        console.log(moveDirection)
                        // 执行事件handler
                        buttonHandler.get(this.downButton)({ moveDirection });
                        // 记录方向
                        this.lastMoveDirection = moveDirection
                        // 重置位置
                        this._reset()
                    }


                    return
                }

                // 获取当前值
                currentPos.x = event.x;
                currentPos.y = event.y;
                if (startPos.x === -1 && startPos.y === -1) {// 获取初始值
                    startPos.x = event.x;
                    startPos.y = event.y;
                    return;
                } 
                let moveDirection = getMoveDirection(startPos, currentPos);

                if (moveDirection) {
                    console.log(moveDirection)
                    // 执行事件handler
                    buttonHandler.get(this.downButton)({ moveDirection });
                    // 记录方向
                    this.lastMoveDirection = moveDirection
                    // 重置位置
                    this._reset()
                }
            }
        })
    }

    _reset (type = 'part') {
        let { startPos, currentPos, lastPos } = this;

        if (type === 'full') {
            this.downButton = 0;// 清除按下的button
            this.lastMoveDirection = null; // 清除上一个移动方向，因为松开按钮之后就可以继续同一个方向了
        }
        // 重置位置变量以继续执行其他handler
        startPos.x = startPos.y = -1;
        currentPos.x = currentPos.y = -1;
        lastPos.x = lastPos.y = -1;
    }

    add (btnType, handler) {
        this.buttonHandler.set(btnType, handler);

        // this.ioHook.disableClickPropagation();
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