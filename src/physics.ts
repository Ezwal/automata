import { at, swap, up, down, left, right, spawn, spawnByName, Idx } from './world'
import { propsById, propsByName, MateriaProps, State } from './properties'
import { scramble } from './util'

type Interaction = (subject: Idx, target: Idx) => Array<Idx>
type Interactions = { [subject: string]: { [target: string]: Interaction }}

const scrambleLeftRight = (i: Idx): Array<Idx> => scramble(left(i), right(i))

const lavaQuench = (water: Idx, lava: Idx): Array<Idx> => [spawnByName(water, 'vapor'), spawnByName(lava, 'ground')]
const glassification = (sand: Idx): Array<Idx> => [spawnByName(sand, 'glass')]

const interactions: Interactions = {
    water: {
        lava: (water: Idx, lava: Idx): Array<Idx> => lavaQuench(lava, water),
    },
    lava: {
        water: (lava: Idx, water: Idx): Array<Idx> => lavaQuench(lava, water),
        sand: (_: Idx, sand: Idx): Array<Idx> => glassification(sand),
    },
    sand: {
        lava: (sand: Idx, _: Idx): Array<Idx> => glassification(sand)
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

const airDensity = propsByName('air').density
const isGravityAffected = (materia: MateriaProps) => materia.name === 'sand' ||
    materia.state === State.Liquid || materia.state === State.Gas
function gravity(center: Idx) {
    const centerMateria = propsById(at(center))
    const falling = centerMateria.density > airDensity ? true : false
    const trajectory = falling ? down : up
    if (!isGravityAffected(centerMateria)) {
        return []
    }
    const target = trajectory(center)
    const potentials = [target, ...scrambleLeftRight(target)]
                           .concat(centerMateria.name !== 'sand' ? scrambleLeftRight(center) : [])

    for (const potential of potentials) {
        const trajectoryMateria = propsById(at(potential))
        if (trajectoryMateria && (falling
            ? trajectoryMateria.density < centerMateria.density
            : trajectoryMateria.density > centerMateria.density)) {
            return swap(center, potential)
        }
    }
    return []
}

export function sim(center: Idx): Array<Idx> {
    const centerMateria = propsById(at(center))
    if (centerMateria.name === 'air') {
        return []
    }
    return gravity(center)
}
