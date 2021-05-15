import { at, swap, up, down, left, right, spawn, Idx } from './world'
import { getProps, getPropsName, MateriaProps } from './properties'
import { scramble } from './util'

type Interaction = (subject: Idx, target: Idx) => Array<Idx>
type Interactions = { [subject: string]: { [target: string]: Interaction }}

const scrambleLeftRight = (i: Idx): Array<Idx> => scramble(left(i), right(i))

const lavaQuench = (water: Idx, lava: Idx): Array<Idx> => [spawn(water, 4), spawn(lava, 1)]
const glassification = (sand: Idx): Array<Idx> => [spawn(sand, 6)]

const interactions: Interactions = {
    water: {
        lava: (water: Idx, lava: Idx): Array<Idx> => lavaQuench(lava, water),
    },
    lava: {
        water: (lava: Idx, water: Idx): Array<Idx> => lavaQuench(lava, water),
        sand: (lava: Idx, sand: Idx): Array<Idx> => glassification(sand),
    },
    sand: {
        lava: (sand: Idx, lava: Idx): Array<Idx> => glassification(sand)
    }
}
const interact = (subject: string, target: string): Interaction => {
    const subjectInteractions = interactions[subject]
    if (subjectInteractions) {
        const targetSubjectInteractions = subjectInteractions[target]
        if (targetSubjectInteractions) {
            return targetSubjectInteractions
        }
    }
}

function stateSim(center: Idx, centerMateria: MateriaProps, potentials: Array<Idx>, isFalling: boolean): Array<Idx> {
    for (let potential of potentials) {
        const trajectoryMateria = getProps(at(potential))
        if (trajectoryMateria) {
            const potentialReaction = interact(centerMateria.name, trajectoryMateria.name)
            if (potentialReaction) {
                return potentialReaction(center, potential)
            }
            if (isFalling ? trajectoryMateria.density < centerMateria.density
                : trajectoryMateria.density > centerMateria.density) {
                return swap(center, potential)
            }
        }
    }
    return []
}

const airDensity = getPropsName('air').density
export function simulate(center: Idx): Array<Idx> {
    const centerMateria = getProps(at(center))
    const falling = centerMateria.density > airDensity ? true : false
    const trajectory = falling ? down : up

    const target = trajectory(center)
    if (centerMateria.state === 'liquid' || centerMateria.state === 'gas') {
        return stateSim(center, centerMateria, [target, ...scrambleLeftRight(target),
                                    ...scrambleLeftRight(center)], falling)
    }
    if (centerMateria.name === 'sand') {
        return stateSim(center, centerMateria, [target, ...scrambleLeftRight(target)], falling)
    }
    return []
}
