import { waterPhysics, gravity, gazPhysics } from './physics.js'

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
        color: [255, 255, 255],
        key: 'a',
    },
    [materia.ground]: {
        density: 100,
        color: [0, 0, 0],
        key: 't',
    },
    [materia.water]: {
        density: 40,
        color: [0, 15, 255],
        physic: waterPhysics,
        key: 'w',
    },
    [materia.sand]: {
        density: 50,
        color: [244, 217, 14],
        physic: gravity,
        key: 's',
    },
    [materia.gaz]: {
        density: 0,
        color: [19, 199, 244],
        physic: gazPhysics,
        key: 'g',
    }
})

export { materia, props }
