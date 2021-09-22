import { at, swap, up, down, left, right, spawn, Idx} from './world'
import { propsById, propsByName, phases, MateriaProps, State } from './properties'
import { scramble } from './util'

type Interaction = (subject: Idx, target: Idx) => Array<Idx>

const scrambleLeftRight = (i: Idx): Array<Idx> => scramble(left(i), right(i))

const airDensity = propsByName('air').density

const isGravityAffected = (materia: MateriaProps) => materia.state === State.Liquid || materia.state === State.Gas

function gravity(center: Idx): Set<Idx> {
    const centerMateria = propsById(at(center))
    const falling = centerMateria.density > airDensity ? true : false
    const trajectory = falling ? down : up
    if (!isGravityAffected(centerMateria)) {
        return new Set()
    }
    const target = trajectory(center)
    const potentials = [target, ...scrambleLeftRight(target)]
                           .concat(centerMateria.name !== 'sand' ? scrambleLeftRight(center) : [])

    for (const potential of potentials) {
        const trajectoryMateria = propsById(at(potential))
        if (trajectoryMateria && (falling
            ? trajectoryMateria.density < centerMateria.density
            : trajectoryMateria.density > centerMateria.density)) {
            return new Set(swap(center, potential))
        }
    }
    return new Set()
}

const phasedMateria = Object.keys(phases).map(id => parseInt(id))
const isAffectedByTemperature = (materia: MateriaProps): boolean => phasedMateria.includes(materia.id)
function temperature(center: Idx): Set<Idx> {
    const centerMateria = propsById(at(center))
    if (!isAffectedByTemperature(centerMateria)) {
        return new Set()
    }

    const potentials = [up(center), down(center), right(center), left(center)]
    for (const potential of potentials) {
        const potentialMateria = propsById(at(potential))
        if (potentialMateria && isAffectedByTemperature(potentialMateria)
            && potentialMateria.temperature !== centerMateria.temperature) {
            const tempDifferential = centerMateria.temperature - potentialMateria.temperature
            const newState = tempDifferential > 0 ? 1 : - 1
            const newCenterMateria = phases[centerMateria.id][centerMateria.state + newState]
            const newPotentialMateria = phases[potentialMateria.id][potentialMateria.state - newState]
            if (newCenterMateria && newPotentialMateria) {
                return new Set([spawn(center, newCenterMateria),
                        spawn(potential, newPotentialMateria)])
            }
        }
    }
    return new Set()
}

export function sim(center: Idx): Set<Idx> {
    const centerMateria = propsById(at(center))
    if (centerMateria.name === 'air') {
        return new Set()
    }
    return new Set([...gravity(center), ...temperature(center)])
}
