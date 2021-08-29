import { at, swap, up, down, left, right, spawnByName, Idx } from './world'
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

function gravity(center: Idx): Array<Idx> {
    return []
}

type Snapshot = {nw: MateriaProps, n: MateriaProps, ne: MateriaProps,
                 w: MateriaProps, c: MateriaProps, e: MateriaProps,
                 sw: MateriaProps, s: MateriaProps, se: MateriaProps}
function takeSnapshot(center: Idx): Snapshot {
    const [nw, n, ne, w, c, e, sw, s, se] = [left(up(center)), up(center), right(up(center)),
                                             left(center), center, right(center),
                                             left(down(center)), down(center), right(down(center))]
                                                .map(el => propsById(at(el)))
    return {nw, n, ne, w, c, e, sw, s, se}
}

function applySnapshot(center: Idx, snap: Snapshot): void {
    // apply snap
}

function sim(center: Idx): Array<Idx> {
    const centerMateria = propsById(at(center))
    const snapshot = takeSnapshot(center)
    // // here if attributes is missing then just dont do anything
    // reaction(temperature(movement(snapshot)))
    // return changed idx
    return []
}

function stateSim(center: Idx, centerMateria: MateriaProps, potentials: Array<Idx>, isFalling: boolean): Array<Idx> {
    for (let potential of potentials) {
        const trajectoryMateria = propsById(at(potential))
        if (trajectoryMateria) {
            const potentialReaction = interact(centerMateria.name, trajectoryMateria.name)
            if (potentialReaction) {
                return potentialReaction(center, potential)
            }
            if (isFalling
                ? trajectoryMateria.density < centerMateria.density
                : trajectoryMateria.density > centerMateria.density) {
                return swap(center, potential)
            }
        }
    }
    return []
}

const airDensity = propsByName('air').density
export function simulate(center: Idx): Array<Idx> {
    const centerMateria = propsById(at(center))
    const falling = centerMateria.density > airDensity ? true : false
    const trajectory = falling ? down : up
    if (centerMateria.name === 'air') {
        return []
    }

    const target = trajectory(center)
    if (centerMateria.state === State.Liquid || centerMateria.state === State.Gas) {
        return stateSim(center, centerMateria, [target, ...scrambleLeftRight(target),
                                    ...scrambleLeftRight(center)], falling)
    }
    if (centerMateria.name === 'sand') {
        return stateSim(center, centerMateria, [target, ...scrambleLeftRight(target)], falling)
    }
    return []
}
