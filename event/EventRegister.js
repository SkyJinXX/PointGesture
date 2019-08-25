const HoldMouseBtnMoveService = require('./HoldMouseBtnMoveService');
const rightBtn = 2;
const leftBtn = 1;
const middleBtn = 3;

class EventRegister {
    constructor (ioHook) {
        this.ioHook = ioHook;
        this.holdMouseBtnMoveService = new HoldMouseBtnMoveService(this.ioHook)
        this.registEvents = {
            holdMouseRBtnMove: (handler) => {
                this.holdMouseBtnMoveService.add(rightBtn, handler);
                
            }
        }
    }
    regist (event, handler) {
        this.registEvents[event](handler);
    }

}

module.exports = EventRegister;