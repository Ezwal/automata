import { simulate } from './physics'
import { materia } from './properties'

export type Idx = number
export type World = number[]

let width = 0
let height = 0
let world = undefined
let lastTouched: Array<Idx> = []

// https://blog.usejournal.com/structurae-data-structures-for-high-performance-javascript-9b7da4c73f8
export function init(w: number, h: number): World {
    width = w
    height = h
    world = []
    for (let i = 0; i < width * height; i++) {
        world[i] = 0
    }
    return world
}

const outOfBond = (id: Idx): boolean => id > 0 && id < world.length
export const at = (id: Idx): Idx => outOfBond(id) ? world[id] : undefined
export const down = (id: Idx): Idx => id + width
export const up = (id: Idx): Idx => id - width
export const right = (id: Idx): Idx => id % (width - 1) !== 0 ? id + 1 : -1
export const left = (id: Idx): Idx => id % width !== 0 ? id - 1 : -1

let paintingIndex: Idx
let paintingMateria: number
export const paint = (x: number, y: number, materia: number): void => {
    const offset = x + y * width
    paintingIndex = offset
    paintingMateria = materia
}
export const stopPainting = (): void => {
    paintingIndex = undefined
}

export function spawnByName(idx: Idx, materiaName: string) {
    return spawn(idx, materia[materiaName])
}

export function spawn(idx: Idx, materia: number) {
    if (idx >= 0 && idx < world.length) {
        world[idx] = materia
        return idx
    }
}

export function swap(idA: Idx, idB: Idx): Array<Idx> {
    const matA = world[idA]

    world[idA] = world[idB]
    world[idB] = matA
    return [idA, idB]
}

export const get = (): World => world

let tickNb = 0
export function tick(): Array<Idx> {
    let currentChange: Array<Idx> = []
    for (let i of lastTouched) {
        if (!currentChange.includes(i)) {
            const touched = simulate(i)
            currentChange = currentChange.concat(touched)
        }
    }
    if (tickNb < 100 && tickNb > 0) {
        currentChange.push(spawnByName(90, 'water'),
                           spawnByName(78, 'sand'))
    }
    if (paintingIndex) {
        const changed = spawn(paintingIndex, paintingMateria)
        if (changed) {
            currentChange.push(changed)
        }
    }

    tickNb += 1
    lastTouched = currentChange
    if (currentChange.length > 0) {
        console.debug('updated idx :', currentChange)
    }
    return currentChange
}

