import { randBetween } from './util'

export enum State {
    Gas = 1,
    Solid,
    Liquid,
}

export interface MateriaProps {
    name: string,
    density: number,
    state: State,
    color: () => number[],
    key: string,
}

export const propsList = [{
        name: 'air',
        density: 10,
        state: State.Gas,
        color: () => [255, 255, 255],
        key: 'a',
    },
    {
        name: 'ground',
        density: 100,
        state: State.Solid,
        color: () => [0, 0, 0],
        key: 't',
    },
    {
        name: 'water',
        density: 40,
        state: State.Liquid,
        color: () => [0, randBetween(0, 60), randBetween(200, 255)],
        key: 'w',
    },
    {
        name: 'sand',
        density: 50,
        state: State.Solid,
        color: () => [randBetween(200, 244), randBetween(200, 217), 14],
        key: 's',
    },
    {
        name: 'vapor',
        density: 0,
        state: State.Gas,
        color: () => [19, 199, 244],
        key: 'v',
    },
    {
        name: 'lava',
        density: 60,
        state: State.Liquid,
        color: () => [181, 3, 3],
        key: 'l'
    },
    {
        name: 'glass',
        density: 45,
        state: State.Solid,
        color: () => [53, 0, 88],
        key: 'g'
    }
]

export const materia = Object.entries(propsList)
    .reduce((prop, [i, v]) => {
        prop[v.name] = Number(i)
        return prop
    }, {})

export function propsByName(propsName: string): MateriaProps {
    return propsById(materia[propsName])
}

export function propsById(propsNb: number): MateriaProps {
    try {
        return propsList[propsNb]
    } catch (err) {
        throw new Error(`Such materia does not exists (nb: ${propsNb})`)
    }
}
