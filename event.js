const events = new Map([
    ['mouseButtonRight', (ioHook, handler) => {
        let downMode = false;
        let startX = -1;
        let startY = -1;

        // 进出按下模式
        ioHook.on('mousedown', event => {
            console.log(event); 
            if (event.button === 2) {
                downMode = true;
            }
        });
        ioHook.on('mouseup', event => {
            // console.log(event); 
            if (event.button === 2) {
                downMode = false;
                startX = -1;
                startY = -1;
            }
        });

        // 鼠标移动判断
        ioHook.on('mousedrag', event => {
            let currentX = event.x;
            let currentY = event.y;

            // console.log(event);
            if (downMode) {// 如果是按下的状态
                if (startX === -1 && startY === -1) {// 获取初始值
                    startX = event.x;
                    startY = event.y;
                    return;
                }
                console.log(startX);
                if (currentX - startX > 20) {// 暂定代表右移
                    handler({ moveDirection: 'right' })
                    downMode = false;
                }
                if (currentX - startX < -20) {// 暂定代表左移
                    handler({ moveDirection: 'left' })
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