import { is, at, swap, up, down, left, right, spawn, Idx } from './world'
import { getProps, MateriaProps } from './properties'
import { scramble } from './util'

type Interaction = object

function force(directions: Array<Idx>, center: Idx, fn: Function): Array<Idx> {
    for (let toCheck of directions) {
        let result = fn(center, toCheck)
        if (result.length !== 0) {
            return result
        }
    }
    return []
}

const densityPropagation = (origin: Idx, destination: Idx): Array<Idx> => {
    const originDensity = getProps(at(origin))?.density
    const destinationDensity = getProps(at(destination))?.density
    if (destinationDensity < originDensity) {
        return swap(destination, origin)
    }
    return []
}
const scrambleLeftRight = (i: Idx): Array<Idx> => scramble(left(i), right(i))
export const gravity = (center: Idx): Array<Idx> => force([down(center)].concat(scrambleLeftRight(down(center))),
                               center,
                               densityPropagation)

const spread = (center: Idx): Array<Idx> => force([down(center)]
                              .concat(scrambleLeftRight(down(center)),
                                      scrambleLeftRight(center)),
                             center,
                             densityPropagation)

const antigravity = (center: Idx): Array<Idx> => force([up(center)].concat(scrambleLeftRight(up(center))),
                                   center,
                                   (origin, destination) => {
                                       const originDensity = getProps(at(origin))?.density
                                       const destinationDensity = getProps(at(destination))?.density
                                       if (destinationDensity > originDensity) {
                                           return swap(destination, origin)
                                       }
                                       return []
                                   })

export function gaz(center: Idx) {
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

export const waterLava = (water: Idx, lava: Idx): Array<Idx> =>
    [spawn(water, 4), spawn(lava, 1)]


const interact = (interactions: Interaction) => (subjectIdx: Idx, targetIdx: Idx): Array<Idx> => {
    const targetMateria = at(targetIdx)
    const targetInteraction = interactions[targetMateria]
    if (targetInteraction) {
        return targetInteraction(subjectIdx, targetIdx)
    } else {
        return interactions['default'](targetMateria)
    }
}

const waterInteraction: Interaction = {
    5: (water: Idx, lava: Idx): Array<Idx> => waterLava(water, lava),
    0: (water: Idx, air: Idx): Array<Idx> => swap(water, air),
    default: () => {}
}
export function water(center: Idx): Array<Idx> {
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

const lavaInteraction: Interaction = {
    2: (lava: Idx, water: Idx) => waterLava(lava, water),
    0: (lava: Idx, other: Idx) => swap(lava, other),
    default: () => {}
}
export function lava(center: Idx): Array<Idx> {
    const potential = [down(center), up(center)].concat(scrambleLeftRight(center))
        for (let target of potential) {
            const interactionResult = interact(lavaInteraction)(center, target)
        if (interactionResult) {
            return interactionResult
        }
    }
    return []
}
