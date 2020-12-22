import { waterPhysics, gravity } from './physics.js'

const materia = Object.freeze({
    air: 0,
    ground: 1,
    water: 2,
    sand: 3,
})

const props = Object.freeze({
    [materia.air]: {
        density: 0,
        color: [255, 255, 255],
    },
    [materia.ground]: {
        density: 100,
        color: [0, 0, 0],
    },
    [materia.water]: {
        density: 40,
        color: [0, 15, 255],
        physic: waterPhysics
    },
    [materia.sand]: {
        density: 50,
        color: [244, 217, 14],
        physic: gravity
    }
})

export { materia, props }
