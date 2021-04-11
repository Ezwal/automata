import { is, at, swap, up, down, left, right, spawn } from './world'
import { getProps } from './properties'
import { scramble } from './util'

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
    const originDensity = getProps(at(origin))?.density
    const destinationDensity = getProps(at(destination))?.density
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
                                       const originDensity = getProps(at(origin))?.density
                                       const destinationDensity = getProps(at(destination))?.density
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
        if (is(toCheck, 0)) {
            return swap(toCheck, center)
        }
    }
    return []
}

export const waterLava = (water, lava) => [spawn(water, 4), spawn(lava, 1)]

const interact = interactions => (subjectIdx, targetIdx) => {
    const targetMateria = at(targetIdx)
    const targetInteraction = interactions[targetMateria]
    if (targetInteraction) {
        return targetInteraction(subjectIdx, targetIdx)
    } else {
        return interactions.default(targetMateria)
    }
}

const waterInteraction = {
    5: (water, lava) => waterLava(water, lava),
    0: (water, air) => swap(water, air),
    default: () => {}
}
export function water(center) {
    const falling = spread(center)
    if (falling.length !== 0) {
        return falling
    }
    for (let target of scramble(left(center), right(center))) {
        const interactionResult = interact(waterInteraction)(center, target)
        if (interactionResult) {
            return interactionResult
        }
    }
    return []
}

const lavaInteraction = {
    2: (lava, water) => waterLava(lava, water),
    0: (lava, other) => swap(lava, other),
    default: () => {}
}
export function lava(center) {
    const potential = [down(center), up(center)].concat(scrambleLeftRight(center))
        for (let target of potential) {
            const interactionResult = interact(lavaInteraction)(center, target)
        if (interactionResult) {
            return interactionResult
        }
    }
    return []
}
