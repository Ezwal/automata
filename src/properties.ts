import { randBetween } from './util'

export enum State {
    Gas = 1,
    Solid,
    Liquid,
}

export interface MateriaProps {
    id: number,
    name: string,
    density: number,
    state: State,
    color: () => number[],
    key: string,
}


const air = {
    id: 0,
    name: 'air',
    density: 10,
    state: State.Gas,
    color: () => [255, 255, 255],
    key: 'a',
}
const ground = {
    id: 1,
    name: 'ground',
    density: 100,
    state: State.Solid,
    color: () => [0, 0, 0],
    key: 't',
}
const water = {
    id: 2,
    name: 'water',
    density: 40,
    state: State.Liquid,
    color: () => [0, randBetween(0, 60), randBetween(200, 255)],
    key: 'w',
}
const sand = {
    id: 3,
    name: 'sand',
    density: 50,
    state: State.Solid,
    color: () => [randBetween(200, 244), randBetween(200, 217), 14],
    key: 's',
}
const vapor = {
    id: 4,
    name: 'vapor',
    density: 0, state: State.Gas, color: () => [19, 199, 244],
    key: 'v',
}
const lava = {
    id: 5,
    name: 'lava',
    density: 60,
    state: State.Liquid,
    color: () => [181, 3, 3],
    key: 'l'
}
const glass = {
    id: 6,
    name: 'glass',
    density: 45,
    state: State.Solid,
    color: () => [53, 0, 88],
    key: 'g'
}

export const propsRegistry = [air, ground, water, sand, vapor, lava, glass]
                                 .reduce((reg, el) => ({
                                     ...reg,
                                     [el.id]: el}), {})

export function propsById(propsNb: number): MateriaProps {
    return propsRegistry[propsNb]
}

export function propsByName(propsName: string): MateriaProps {
    return Object
        .values(propsRegistry)
        .find((props: MateriaProps) => props.name === propsName)
}
