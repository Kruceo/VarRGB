import { rot, scaleXForm, scaleYForm } from "./scales.mjs"
import { distanceBetweenPoints, formExtraInfo, separeToComp, sortToRender } from "./utils.mjs"

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const vid = document.querySelector("img")

let [mouseX, mouseY] = [0, 0]

window.save = save

setTimeout(() => {
    canvas.width = vid.offsetWidth
    canvas.height = vid.offsetHeight
    pointsCache = ""
}, 250)

const points = load()
// [[100, 100], [200, 100], [200, 350], [100, 300]]

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

    // renderForm(scaleYForm(points, -120), "#00f")

    renderLine(ctx, scaleYForm(points, 0), mouseX, mouseY)
}, 1000 / 5)


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

function renderForm(list, color, fillColor) {
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

function load() {
    return window.localStorage.getItem("points").split(",").reduce((acc, val) => {
        const t = acc.length - 1

        acc[t].push(parseInt(val))

        if (acc[t].length == 2)
            acc.push([])

        return acc
    }, [[]]).slice(0, 4)
}

function save() {
    window.localStorage.setItem("points", points.toString())
}

function calcYLineBetweenPoints(points, targetTopX) {
    let pointsCopy = points.map(y => y.map(x => x))

    let f = separeToComp(pointsCopy)

    let [topL,] = f.part1
    let [bottomL,] = f.part2

    const config = formExtraInfo(pointsCopy)

    let val = (targetTopX - topL[0]) / config.topDeltaX

    let x1 = topL[0] + config.topDeltaX * val
    let y1 = topL[1] + config.topDeltaY * val

    let x2 = bottomL[0] + config.bottomDeltaX * val
    let y2 = bottomL[1] + config.bottomDeltaY * val

    return [[x1, y1], [x2, y2]]
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number[][]} points 
 * @param {number} mouseX 
 * @param {number} mouseY 
 */
function renderLine(ctx, points, mouseX, mouseY) {

    var [[x1, y1], [x2, y2]] = calcYLineBetweenPoints(points, mouseX)

    // const dfs = mouseX - x2    // diferença entre o mouseX e o x do ponto de baixo da linha traçada 
    // const pfs = y2 - y1        // diferenca entre os "y" dos pontos da linha traçada 
    // const tfs = dfs / pfs      // relação entre a diferença do mouse e a diferenca de altura da linha traçada 
    // const mfs = y1 - mouseY  // diferença do ponto y mais alto da linha traçada com o y do mouse 

    ctx.strokeStyle = "#f0f"
    ctx.ellipse(x1, y1, 20, 20, 0, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.beginPath()

    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.beginPath()

    ctx.ellipse(x2, y2, 20, 20, 0, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.beginPath()

    ctx.strokeStyle = "#ff0"

}