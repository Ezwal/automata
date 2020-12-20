import { is, swap, down, left, right } from './world.js'

const materia = Object.freeze({
    air: 0,
    ground: 1,
    water: 2,
    sand: 3,
})

const materiaColor = Object.freeze({
    [materia.air]: [255, 255, 255],
    [materia.ground]: [0, 0, 0],
    [materia.water]: [0, 15, 255],
    [materia.sand]: [244, 217, 14],
})

function sandPhysics(center) {
    for (let toCheck of [down(center), left(down(center)), right(down(center))]) {
        if (is(toCheck, materia.air))  {
            swap(toCheck, center)
            return [toCheck, center]
        }
    }
    return []
}

function waterPhysics(center) {
    for (let toCheck of [down(center), left(down(center)), right(down(center))]) {
        if (is(toCheck, materia.air))  {
            swap(toCheck, center)
            return [toCheck, center]
        }
    }
    if (is(down(center), materia.water)) {
        for (let toCheck of [left(center), right(center)]) {
            if (is(toCheck, materia.air)) {
                swap(toCheck, center)
                return [toCheck, center]
            }
        }
    }
    return []
}

const materiaPhysics = Object.freeze({
    [materia.water]: waterPhysics,
    [materia.sand]: sandPhysics,
})

export { materiaPhysics, materiaColor }
