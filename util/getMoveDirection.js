const angle_45 = Math.PI / 4;
const angle_135 = Math.PI / 4 + Math.PI / 2;
const angle_225 = Math.PI / 4 + Math.PI;
const angle_315 = Math.PI / 4 + Math.PI + Math.PI / 2;

const getMoveDirection = (start, current, lastMoveDirection) => {
    const yLength = current.y - start.y;
    const xLength = current.x - start.x;
    const length = Math.sqrt(xLength * xLength + yLength * yLength);
    const cos = xLength / length;
    let moveDirection = null;

    // 判断方向的逻辑
    if (length < 40) return null;
    if (yLength >= 0) {
        if (cos >= Math.cos(angle_45)) moveDirection = "right";
        if (cos <= Math.cos(angle_45) && cos >= Math.cos(angle_135))
            moveDirection = "down";
        if (cos <= Math.cos(angle_135)) moveDirection = "left";
    } else {
        if (cos <= Math.cos(angle_225)) moveDirection = "left";
        if (cos > Math.cos(angle_225) && cos < Math.cos(angle_315))
            moveDirection = "up";
        if (cos >= Math.cos(angle_315)) moveDirection = "right";
    }

    // 拦截返回：如果触发过事件，但没放开按钮
    if (lastMoveDirection) {
        switch (lastMoveDirection) {
            case "up":
                if (moveDirection !== "down") return null;
                break;
            case "down":
                if (moveDirection !== "up") return null;
                break;
            case "left":
                if (moveDirection !== "right") return null;
                break;
            case "right":
                if (moveDirection !== "left") return null;
                break;
        }
    }

    return moveDirection;
};

module.exports = getMoveDirection;
