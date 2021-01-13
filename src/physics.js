import { is, at, swap, up, down, left, right, spawn } from './world.js'
import { materia, props, interaction } from './materia.js'
import { scramble } from './util.js'

function force(directions, center, fn) {
    for (let toCheck of directions) {
        let result = fn(center, toCheck)
        if (result.length !== 0) {
            return result
        }
    }
    return []
}

const densityPropagation = (origin, destination) => {
    const originDensity = props[at(origin)]?.density
    const destinationDensity = props[at(destination)]?.density
    if (destinationDensity < originDensity) {
        return swap(destination, origin)
    }
    return []
}
const scrambleLeftRight = i => scramble(left(i), right(i))
export const gravity = center => force([down(center)].concat(scrambleLeftRight(down(center))),
                               center,
                               densityPropagation)

const spread = center => force([down(center)]
                              .concat(scrambleLeftRight(down(center)),
                                      scrambleLeftRight(center)),
                             center,
                             densityPropagation)

const antigravity = center => force([up(center)].concat(scrambleLeftRight(up(center))),
                                   center,
                                   (origin, destination) => {
                                       const originDensity = props[at(origin)]?.density
                                       const destinationDensity = props[at(destination)]?.density
                                       if (destinationDensity > originDensity) {
                                           return swap(destination, origin)
                                       }
                                       return []
                                   })

export function gaz(center) {
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

export const waterLava = (water, lava) => [spawn(water, materia.gaz), spawn(lava, materia.ground)]

const interact = subjectMateria => (subjectIdx, targetIdx) => {
    const materiaInteraction = interaction[subjectMateria]
    const targetMateria = at(targetIdx)
    const targetInteraction = materiaInteraction[targetMateria]
    if (targetInteraction) {
        return targetInteraction(subjectIdx, targetIdx)
    }
}

export function water(center) {
    const falling = spread(center)
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

export function lava(center) {
    const potential = [down(center), up(center)].concat(scramble(left(center), right(center)))
    for (let target of potential) {
        const interactionResult = interact(materia.lava)(center, target)
        if (interactionResult) {
            return interactionResult
        }
    }
    return gravity(center)
}
