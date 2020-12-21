import { is, at, swap, down, left, right } from './world.js'
import { scramble } from './util.js'

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

const materiaDensity = Object.freeze({
    [materia.air]: 0,
    [materia.ground]: 100,
    [materia.water]: 50,
    [materia.sand]: 60,
})

function gravity(center) {
    const centerDensity = materiaDensity[at(center)]
    const belowIndex = down(center)
    for (let toCheck of [belowIndex, left(belowIndex), right(down(center))]) {
        if (materiaDensity[at(toCheck)] < centerDensity) {
            return swap(toCheck, center)
        }
    }
    return []
}

function waterPhysics(center) {
    const belowIndex = down(center)
    const falling = gravity(center)
    if (falling.length !== 0) {
        return falling
    }
    if (is(belowIndex, materia.water)) {
        for (let toCheck of [left(center), right(center)]) {
            if (is(toCheck, materia.air)) {
                return swap(toCheck, center)
            }
        }
    }
    return []
}

const materiaPhysics = Object.freeze({
    [materia.water]: waterPhysics,
    [materia.sand]: gravity,
})

export { materiaPhysics, materiaColor }
