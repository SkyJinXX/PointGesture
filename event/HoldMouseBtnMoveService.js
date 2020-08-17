const robot = require("robotjs");
const getMoveDirection = require("../util/getMoveDirection");

const mousedown = "mousedown";
const mouseup = "mouseup";
const mousedrag = "mousedrag";
const mousemove = "mousemove";
const rightBtn = 2;
const leftBtn = 1;
const middleBtn = 3;
const btn2RobotBtn = {
    [rightBtn]: "right",
    [middleBtn]: "middle",
    [leftBtn]: "left",
};

class HoldMouseBtnMoveService {
    constructor(ioHook) {
        this.ioHook = ioHook;
        this.buttonHandler = new Map();
        this.listenerMap = new Map();
        this.downButtonStack = []; // 用栈记录按下button的顺序
        this.startPos = { x: -1, y: -1 }; // 初始化/重置
        this.currentPos = { x: -1, y: -1 }; // 初始化/更新/重置
        this.lastPos = { x: -1, y: -1 }; // 初始化/更新/重置
        this.lastMoveDirection = null; // 初始化/更新/重置
        this.letItGo = false;

        this._initListenerMap();
        this.start();
    }

    _initListenerMap() {
        const listenerMap = this.listenerMap;
        let { startPos, currentPos, lastPos, letItGo, buttonHandler } = this;

        listenerMap.set(mousedown, (event) => {
            // console.log(event);
            if (letItGo) return;

            this.downButtonStack.push(event.button); // 记录按下的button，给mousedrag用
        });
        listenerMap.set(mouseup, (event) => {
            // console.log(event);
            let downButton = this.downButtonStack.pop();
            if (letItGo) {
                letItGo = false;
                return;
            }
            // 未移动鼠标时，触发真正的单击
            if (!this.lastMoveDirection && downButton !== leftBtn) {
                letItGo = true;
                this.ioHook.enableClickPropagation();
                robot.mouseClick(btn2RobotBtn[downButton]);
                this.ioHook.disableClickPropagation();
            }

            this._reset("full");
        });
        listenerMap.set(mousedrag, (event) => {
            // console.log(event);
            // 前置判断： 没注册过这个btn，就什么也不做(多个button同时按下时，仅判断最后按下的)
            if (!this.downButtonStack.length) {
                return;
            }
            let downButton = this.downButtonStack[
                this.downButtonStack.length - 1
            ];
            if (!buttonHandler.has(downButton)) {
                return;
            }

            // 初始化||更新：currentPos
            currentPos.x = event.x;
            currentPos.y = event.y;
            // 初始化：startPos
            if (startPos.x === -1 && startPos.y === -1) {
                if (!this.lastMoveDirection) {
                    startPos.x = event.x;
                    startPos.y = event.y;
                } else {
                    // 触发事件后不松手的情况
                    // 初始化lastPos
                    if (lastPos.x === -1 && lastPos.y === -1) {
                        lastPos.x = event.x;
                        lastPos.y = event.y;
                        return;
                    }

                    switch (this.lastMoveDirection) {
                        case "up":
                            if (currentPos.y > lastPos.y) {
                                startPos.x = event.x;
                                startPos.y = event.y;
                            }
                            break;
                        case "down":
                            if (currentPos.y < lastPos.y) {
                                startPos.x = event.x;
                                startPos.y = event.y;
                            }
                            break;
                        case "left":
                            if (currentPos.x > lastPos.x) {
                                startPos.x = event.x;
                                startPos.y = event.y;
                            }
                            break;
                        case "right":
                            if (currentPos.x < lastPos.x) {
                                startPos.x = event.x;
                                startPos.y = event.y;
                            }
                            break;
                    }
                    // 更新: lastPos
                    lastPos.x = currentPos.x;
                    lastPos.y = currentPos.y;
                }
                return;
            }
            // 获取并处理方向
            let moveDirection = getMoveDirection(
                startPos,
                currentPos,
                this.lastMoveDirection
            );

            if (moveDirection) {
                console.log(moveDirection);
                // 执行事件handler
                buttonHandler.get(downButton)({ moveDirection });
                // 记录方向
                this.lastMoveDirection = moveDirection;
                // 重置位置
                this._reset();
            }
        });
    }

    _reset(type = "part") {
        let { startPos, currentPos, lastPos } = this;

        if (type === "full") {
            this.lastMoveDirection = null; // 清除上一个移动方向，因为松开按钮之后就可以继续同一个方向了
        }
        // 重置位置变量
        startPos.x = startPos.y = -1;
        currentPos.x = currentPos.y = -1;
        lastPos.x = lastPos.y = -1;
    }

    add(btnType, handler) {
        this.buttonHandler.set(btnType, handler);

        this.ioHook.disableClickPropagation();
    }

    remove(btnType, handler) {
        // 移除button从buttonHandler
        // 如果uttonHandler空了，就不禁用鼠标点击了
    }

    start() {
        let { ioHook, listenerMap } = this;

        for (let [key, value] of listenerMap.entries()) {
            ioHook.addListener(key, value);
        }
    }

    stop() {
        let { ioHook, listenerMap } = this;

        for (let [key, value] of listenerMap.entries()) {
            ioHook.removeListener(key, value);
        }
    }
}

module.exports = HoldMouseBtnMoveService;
