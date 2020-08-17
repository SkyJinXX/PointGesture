const ioHook = require("iohook");
const doAction = require("./action");
const EventRegister = require("./event/EventRegister");

class PointGesture {
    constructor() {
        this.ioHook = ioHook;
        this.register = new EventRegister(this.ioHook);
        this.isActive = false;

        this.register.regist("holdMouseRBtnMove", (e) => {
            switch (e.moveDirection) {
                case "up":
                    doAction("taskView");
                    break;
                case "down":
                    doAction("taskView");
                    break;
                case "left":
                    doAction("desktopRight");
                    break;
                case "right":
                    doAction("desktopLeft");
                    break;
                default:
                    break;
            }
        });
    }
    active() {
        this.ioHook.start(false);
        this.ioHook.disableClickPropagation();
        this.isActive = true;
    }
    pause() {
        this.ioHook.stop();
        this.ioHook.enableClickPropagation();
        this.isActive = false;
    }
    /**
     * 因为iohook会自动load，所以这里不需要load
     */
    start() {
        this.active();
    }
    stop() {
        this.pause();
        this.ioHook.unload();
    }
}

module.exports = PointGesture;
