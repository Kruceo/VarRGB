import { rot, scaleXForm, scaleYForm } from "./scales/scale"
import { distanceBetweenPoints, formExtraInfo, separeToComp, sortToRender } from "./utils/utils"
import type { Rect, Point } from "./utils/index"
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
const vid = document.querySelector("img") as HTMLImageElement

(window as any).save = save

let [mouseX, mouseY] = [0, 0]

setTimeout(() => {
    canvas.width = vid.offsetWidth
    canvas.height = vid.offsetHeight
    pointsCache = ""
}, 250)

const points: Rect =
    // [[150, 50], [250, 30], [330, 550], [50, 500]]
load()

let pointsCache = ""
setInterval(() => {
    if (points.toString() + mouseX + mouseY == pointsCache) return
    pointsCache = points.toString() + mouseX + mouseY

    ctx.lineWidth = 1
    ctx.drawImage(vid, 0, 0)
    ctx.strokeStyle = "#f00"
    points.forEach(each => {
        ctx.ellipse(each[0], each[1], 20, 20, 0, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.fillText(each[0] + "," + each[1], each[0], each[1])
    })

    renderForm(points, "#f00")

    renderLine(ctx, points, mouseX, mouseY)
}, 1000 / 60)


let mouseDown = false
canvas.onmousedown = () => mouseDown = true
canvas.onmouseup = () => mouseDown = false

canvas.onmousemove = (e) => {
    mouseX = e.offsetX
    mouseY = e.offsetY

    const closer = points.reduce((acum, next, index) => {
        const dis = distanceBetweenPoints([mouseX, mouseY], next)
        if (dis < acum.dis) return { dis, index }
        return acum
    }, { dis: 20000, index: -1 })

    if (mouseDown && closer.dis < 20) {
        points[closer.index] = [mouseX, mouseY]
    }
}

function renderForm(list, color, fillColor?) {
    ctx.beginPath()
    ctx.strokeStyle = color ?? "#f00"
    ctx.fillStyle = fillColor ?? "#0000"

    sortToRender(list).forEach((each, index) => {
        ctx.lineTo(each[0], each[1])
    })
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
    ctx.beginPath()

}

function load(): Rect {
    const stored = window.localStorage.getItem("points")
    if (!stored) return [[10, 10], [30, 30], [30, 10], [10, 30]]

    return stored.split(",").reduce((acc, val) => {
        const t = acc.length - 1

        acc[t].push(parseInt(val))

        if (acc[t].length == 2)
            acc.push([])

        return acc
    }, [[]] as number[][]).slice(0, 4) as Rect
}

function save() {
    window.localStorage.setItem("points", points.toString())
}

function calcYLinePercentBetweenPoints(points: Rect, percent: number): [Point, Point] {
    let pointsCopy = points.map(y => y.map(x => x)) as Rect

    let f = separeToComp(pointsCopy)

    let [topL,] = f.part1
    let [bottomL,] = f.part2

    const config = formExtraInfo(pointsCopy)

    let x1 = topL[0] + config.topDeltaX * percent
    let y1 = topL[1] + config.topDeltaY * percent

    let x2 = bottomL[0] + config.bottomDeltaX * percent
    let y2 = bottomL[1] + config.bottomDeltaY * percent

    return [[x1, y1], [x2, y2]]
}

function calcXLinePercentBetweenPoints(points: Rect, percent: number): [Point, Point] {
    let pointsCopy = points.map(y => y.map(x => x)) as Rect

    let f = separeToComp(pointsCopy)

    let [topL, topR] = f.part1

    const config = formExtraInfo(pointsCopy)

    let x1 = topL[0] - config.leftDeltaX * percent
    let y1 = topL[1] - config.leftDeltaY * percent

    let x2 = topR[0] - config.rightDeltaX * percent
    let y2 = topR[1] - config.rightDeltaY * percent

    return [[x1, y1], [x2, y2]]
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number[][]} points 
 * @param {number} mouseX 
 * @param {number} mouseY 
 */
function renderLine(ctx: CanvasRenderingContext2D, points: Rect, mouseX: number, mouseY: number) {
    const f = separeToComp(points)

    const mouseXdiff = mouseX - f.part1[0][0]

    const percentage = mouseXdiff / (f.part1[1][0] - f.part1[0][0])

    const [[x1, y1], [x2, y2]] = calcYLinePercentBetweenPoints(points, percentage)

    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    // ctx.stroke()
    ctx.beginPath()

    t(points, mouseX, mouseY)
}


function t(poinits: Rect, mouseX: number, mouseY: number) {

    const distSide = distanceToSides(points, mouseX, mouseY)

    const sideFullDist = distSide.left + distSide.right

    const line = calcYLinePercentBetweenPoints(poinits, distSide.left / sideFullDist)

    ctx.moveTo(line[0][0],line[0][1])

    ctx.lineTo(line[1][0],line[1][1])

    ctx.stroke()
    ctx.beginPath()
}


function distanceToSides(poinits: Rect, mouseX: number, mouseY: number) {
    const f = separeToComp(poinits)

    const config = formExtraInfo(poinits)

    const mouseLdiffY = mouseY - f.part1[0][1]
    const mouseRdiffY = mouseY - f.part1[1][1]

    const lAdd = mouseLdiffY * config.leftPixelDeltaX

    const rAdd = mouseRdiffY * config.rightPixelDeltaX

    let point1 = { x: f.part1[0][0] + lAdd, y: mouseY }
    let point2 = { x: f.part1[1][0] + rAdd, y: mouseY }

    let mouseToPointDeltaL = point1.x - mouseX
    let mouseToPointDeltaR = point2.x - mouseX

    return { left: Math.abs(mouseToPointDeltaL), right: Math.abs(mouseToPointDeltaR) }
}