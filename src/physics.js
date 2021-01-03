import { is, at, swap, up, down, left, right, spawn } from './world.js'
import { materia, props, interaction } from './materia.js'
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

const waterLava = (water, lava) => [spawn(water, materia.gaz), spawn(lava, materia.ground)]

const interact = subjectMateria => (subjectIdx, targetIdx) => {
    const materiaInteraction = interaction[subjectMateria]
    const targetMateria = at(targetIdx)
    const targetInteraction = materiaInteraction[targetMateria]
    if (targetInteraction) {
        return targetInteraction(subjectIdx, targetIdx)
    }
}

function water(center) {
    const falling = gravity(center)
    if (falling.length !== 0) {
        return falling
    }
    for (let target of scramble(left(center), right(center))) {
        const interactionResult = interact(materia.water)(center, target)
        if (interactionResult) {
            return interactionResult
        }
    }
    return []
}

function lava(center) {
    const potential = [down(center), up(center)].concat(scramble(left(center), right(center)))
    for (let target of potential) {
        const interactionResult = interact(materia.lava)(center, target)
        if (interactionResult) {
            return interactionResult
        }
    }
    return gravity(center)
}

export default { water, gravity, gaz, lava }
