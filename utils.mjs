function formExtraInfo(list) {
    const f = separeToComp(list)

    const topDeltaX = f.part1[1][0] - f.part1[0][0]
    const topDeltaY = f.part1[1][1] - f.part1[0][1]
    const topPixelDeltaX = topDeltaX / topDeltaY
    const topPixelDeltaY = topDeltaY / topDeltaX

    const rightDeltaX = (f.part1[1][0] - f.part2[1][0])
    const rightDeltaY = (f.part1[1][1] - f.part2[1][1])
    const rightPixelDeltaX = rightDeltaX / rightDeltaY

    const leftDeltaX = (f.part1[0][0] - f.part2[0][0])
    const leftDeltaY = (f.part1[0][1] - f.part2[0][1])
    const leftPixelDeltaX = leftDeltaX / leftDeltaY

    const bottomDeltaX = f.part2[1][0] - f.part2[0][0]
    const bottomDeltaY = f.part2[1][1] - f.part2[0][1]
    const bottomPixelDeltaY = bottomDeltaY / bottomDeltaX

    const topBottomCoefX = (bottomDeltaX / topDeltaX)
    const topBottomCoefY = (bottomDeltaY / topDeltaY)

    return {
        topDeltaX,
        topDeltaY,
        rightDeltaX,
        rightDeltaY,
        rightPixelDeltaX,
        leftDeltaX,
        leftDeltaY,
        leftPixelDeltaX,
        topPixelDeltaX,
        topPixelDeltaY,
        bottomDeltaX,
        bottomDeltaY,
        bottomPixelDeltaY,
        topBottomCoefX,
        topBottomCoefY
    }
}

function separeToComp(list) {
    const d = list.sort((a, b) => a[1] - b[1])
    const part1 = d.slice(0, 2).sort((a, b) => a[0] - b[0])
    const part2 = d.slice(2, 4).sort((a, b) => a[0] - b[0])
    return { part1, part2 }
}

function sortToRender(list) {
    // return list
    const d = list.sort((a, b) => a[1] - b[1])
    // return d
    const part1 = d.slice(0, 2).sort((a, b) => a[0] - b[0])
    const part2 = d.slice(2, 4).sort((a, b) => b[0] - a[0])

    return [...part1, ...part2]
}

function distanceBetweenPoints(point1, point2) {

    var deltaX = point2[0] - point1[0];
    var deltaY = point2[1] - point1[1];
    var distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return distancia;

}

export { sortToRender, separeToComp, formExtraInfo, distanceBetweenPoints }