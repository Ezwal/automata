import * as physics from './physics.js'
import { randBetween } from './util.js'

export interface MateriaProps {
    name: string,
    density: number,
    color: () => number[],
    key: string,
    physic?: any
}

export const propsList = [{
        name: 'air',
        density: 10,
        color: () => [255, 255, 255],
        key: 'a',
    },
    {
        name: 'ground',
        density: 100,
        color: () => [0, 0, 0],
        key: 't',
    },
    {
        name: 'water',
        density: 40,
        color: () => [0, randBetween(0, 60), randBetween(200, 255)],
        physic: physics.water,
        key: 'w',
    },
    {
        name: 'sand',
        density: 50,
        color: () => [randBetween(200, 244), randBetween(200, 217), 14],
        physic: physics.gravity,
        key: 's',
    },
    {
        name: 'gaz',
        density: 0,
        color: () => [19, 199, 244],
        physic: physics.gaz,
        key: 'g',
    },
    {
        name: 'lava',
        density: 60,
        color: () => [181, 3, 3],
        physic: physics.lava,
        key: 'l'
    },
]

export const materia = Object.entries(propsList)
    .reduce((prop, [i, v]) => {
        prop[v.name] = Number(i)
        return prop
    }, {})

export function getProps(propsNb: number): MateriaProps {
    try {
        return propsList[propsNb]
    } catch (err) {
        throw new Error('Such materia does not exists (nb: ${propsNb})')
    }
}
