const angle_45 = Math.PI / 4;
const angle_135 = Math.PI / 4 + Math.PI / 2;
const angle_225 = Math.PI / 4 + Math.PI;
const angle_315 = Math.PI / 4 + Math.PI + Math.PI / 2;

const getMoveDirection = (start, current) => {
    const yLength = current.y - start.y;
    const xLength = current.x - start.x;
    const length = Math.sqrt(xLength * xLength + yLength * yLength);
    const cos = xLength / length;

    if (length < 20) return null;
    if (yLength >= 0) {
        if (cos >= Math.cos(angle_45)) return 'right';
        if (cos <= Math.cos(angle_45) && cos >= Math.cos(angle_135)) return 'up';
        if (cos <= Math.cos(angle_135)) return 'left';
    } else {
        if (cos <= Math.cos(angle_225)) return 'left';
        if (cos > Math.cos(angle_225) && cos < Math.cos(angle_315)) return 'down';
        if (cos >= Math.cos(angle_315)) return 'right';
    }

    return null;
}

module.exports = getMoveDirection;
