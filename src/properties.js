import * as physics from './physics.js'
import materia from './materia.js'
import { randBetween } from './util.js'

export default Object.freeze({
    [materia.air]: {
        name: 'air',
        density: 10,
        color: () => [255, 255, 255],
        key: 'a',
    },
    [materia.ground]: {
        name: 'ground',
        density: 100,
        color: () => [0, 0, 0],
        key: 't',
    },
    [materia.water]: {
        name: 'water',
        density: 40,
        color: () => [0, randBetween(0, 60), randBetween(200, 255)],
        physic: physics.water,
        key: 'w',
    },
    [materia.sand]: {
        name: 'sand',
        density: 50,
        color: () => [randBetween(200, 244), randBetween(200, 217), 14],
        physic: physics.gravity,
        key: 's',
    },
    [materia.gaz]: {
        name: 'vapor',
        density: 0,
        color: () => [19, 199, 244],
        physic: physics.gaz,
        key: 'g',
    },
    [materia.lava]: {
        name: 'lava',
        density: 60,
        color: () => [181, 3, 3],
        physic: physics.lava,
        key: 'l'
    },
})
