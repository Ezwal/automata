import * as physics from './physics'
import { randBetween } from './util'

export interface MateriaProps {
    name: string,
    density: number,
    state: string,
    color: () => number[],
    key: string,
    physic?: any
}

export const propsList = [{
        name: 'air',
        density: 10,
        state: 'gas',
        color: () => [255, 255, 255],
        key: 'a',
    },
    {
        name: 'ground',
        density: 100,
        state: 'solid',
        color: () => [0, 0, 0],
        key: 't',
    },
    {
        name: 'water',
        density: 40,
        state: 'liquid',
        color: () => [0, randBetween(0, 60), randBetween(200, 255)],
        physic: physics.water,
        key: 'w',
    },
    {
        name: 'sand',
        density: 50,
        state: 'solid',
        color: () => [randBetween(200, 244), randBetween(200, 217), 14],
        physic: physics.gravity,
        key: 's',
    },
    {
        name: 'vapor',
        density: 0,
        state: 'gas',
        color: () => [19, 199, 244],
        physic: physics.gaz,
        key: 'g',
    },
    {
        name: 'lava',
        density: 60,
        state: 'liquid',
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
