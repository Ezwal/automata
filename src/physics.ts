import { at, swap, up, down, left, right, spawn, spawnByName, Idx} from './world'
import { propsById, propsByName, phases, MateriaProps, State } from './properties'
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

const phasedMateria = Object.keys(phases).map(id => parseInt(id))
const isAffectedByTemperature = (materia: MateriaProps) => phasedMateria.includes(materia.id)
function temperature(center: Idx) {
    const centerMateria = propsById(at(center))
    if (!isAffectedByTemperature(centerMateria)) {
        return []
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
                return [spawn(center, newCenterMateria.id),
                        spawn(potential, newPotentialMateria.id)]
            }
        }
    }
    return []
}

export function sim(center: Idx): Array<Idx> {
    const centerMateria = propsById(at(center))
    if (centerMateria.name === 'air') {
        return []
    }
    return gravity(center).concat(temperature(center))
}
