import { at, swap, up, down, left, right, spawn, spawnByName, Idx } from './world'
import { propsById, propsByName, MateriaProps, State } from './properties'
import { scramble } from './util'

type Interaction = (subject: Idx, target: Idx) => Array<Idx>
type Interactions = { [subject: string]: { [target: string]: Interaction }}

const scrambleLeftRight = (i: Idx): Array<Idx> => scramble(left(i), right(i))

const airDensity = propsByName('air').density

const isGravityAffected = (materia: MateriaProps) => materia.state === State.Liquid || materia.state === State.Gas

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

function temperature(center: Idx) {
    const centerMateria = propsById(at(center))
    return []
}

export function sim(center: Idx): Array<Idx> {
    const centerMateria = propsById(at(center))
    if (centerMateria.name === 'air') {
        return []
    }
    return gravity(center)
}
