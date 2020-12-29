import physics from './physics.js'
import { randBetween } from './util.js'

const materia = Object.freeze({
    air: 0,
    ground: 1,
    water: 2,
    sand: 3,
    gaz: 4,
})

const props = Object.freeze({
    [materia.air]: {
        density: 10,
        color: () => [255, 255, 255],
        key: 'a',
    },
    [materia.ground]: {
        density: 100,
        color: () => [0, 0, 0],
        key: 't',
    },
    [materia.water]: {
        density: 40,
        color: () => [0, randBetween(0, 60), randBetween(200, 255)],
        physic: physics.water,
        key: 'w',
    },
    [materia.sand]: {
        density: 50,
        color: () => [randBetween(200, 244), randBetween(200, 217), 14],
        physic: physics.gravity,
        key: 's',
    },
    [materia.gaz]: {
        density: 0,
        color: () => [19, 199, 244],
        physic: physics.gaz,
        key: 'g',
    }
})

export { materia, props }
