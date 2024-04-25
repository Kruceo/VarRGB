import { formExtraInfo, separeToComp } from "./utils.mjs"

export function scaleYForm(list, value) {
    const f = separeToComp(list)
    const config = formExtraInfo(list)

    // console.log(yCoef, xCoef)
    const o = [...f.part1, ...f.part2].map((each, index) => {

        let [x, y] = each

        const lcoef = config.leftDeltaX / config.leftDeltaY

        const rcoef = config.rightDeltaX / config.rightDeltaY

        const vf = config.rightDeltaY / config.leftDeltaY

        //TOP
        if (index == 0) //LEFT
            return [x + value * lcoef, y + value]
        if (index == 1) //RIGHT
            return [x + (value * vf) * rcoef, y + (value * vf)]

        //BOTTOM 
        if (index == 2)
            return [x - (value) * lcoef, y - value]
        if (index == 3)
            return [x - (value * vf) * rcoef, y - value * vf]
        return each
    })
    return o
}


export function scaleXForm(list, value) {
    let t = rot(list)
    let y = scaleYForm(t, value)
    let result = rot(y)
    return result
}


export function rot(list) {
    const f = separeToComp(list)

    const t = list.map(each => [each[1], each[0]])
    return t
}