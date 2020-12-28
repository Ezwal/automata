import { is, at, swap, up, down, left, right } from './world.js'
import { materia, props } from './materia.js'
import { scramble } from './util.js'

function gravity(center) {
    const centerDensity = props[at(center)].density
    const belowIndex = down(center)
    for (let toCheck of [belowIndex].concat(scramble(left(belowIndex), right(belowIndex)))) {
        let toCheckDensity = props[at(toCheck)]?.density
        if (toCheckDensity < centerDensity) {
            return swap(toCheck, center)
        }
    }
    return []
}

function waterPhysics(center) {
    const falling = gravity(center)
    if (falling.length !== 0) {
        return falling
    }
    for (let toCheck of scramble(left(center), right(center))) {
        if (is(toCheck, materia.air)) {
            return swap(toCheck, center)
        }
    }
    return []
}

function gazPhysics(center) {
    const centerDensity = props[at(center)].density
    const upperIndex = up(center)
    for (let toCheck of [upperIndex].concat(scramble(left(upperIndex), right(upperIndex)))) {
        let toCheckDensity = props[at(toCheck)]?.density
        if (toCheckDensity > centerDensity) {
            return swap(toCheck, center)
        }
    }
    return []
}

export { waterPhysics, gravity, gazPhysics }
