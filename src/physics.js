import { is, at, swap, up, down, left, right } from './world.js'
import { materia, props } from './materia.js'
import { scramble } from './util.js'

function force(direction, center, operation) {
    const directionIndex = direction(center)
    for (let toCheck of [directionIndex].concat(scramble(left(directionIndex), right(directionIndex)))) {
        let result = operation(center, toCheck)
        if (result.length !== 0) {
            return result
        }
    }
    return []
}
const gravity = center => force(down, center, (origin, destination) => {
    const originDensity = props[at(origin)]?.density
    const destinationDensity = props[at(destination)]?.density
    if (destinationDensity < originDensity) {
        return swap(destination, center)
    }
    return []
})
const antigravity = center => force(up, center, (origin, destination) => {
    const originDensity = props[at(origin)]?.density
    const destinationDensity = props[at(destination)]?.density
    if (destinationDensity > originDensity) {
        return swap(destination, origin)
    }
    return []
})

function gaz(center) {
    const floating = antigravity(center)
    if (floating.length !== 0) {
        return floating
    }
    for (let toCheck of scramble(left(center), right(center))) {
        if (is(toCheck, materia.air)) {
            return swap(toCheck, center)
        }
    }
    return []
}

function water(center) {
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

export default { water, gravity, gaz }
