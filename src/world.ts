import { sim } from './physics'
import { propsByName } from './properties'

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

export function spawnByName(idx: Idx, materiaName: string) {
    return spawn(idx, propsByName(materiaName).id)
}

export function spawn(idx: Idx, materia: number): Idx | undefined {
    if (idx >= 0 && idx < world.length) {
        world[idx] = materia
        return idx
    }
}

export function swap(idA: Idx, idB: Idx): Array<Idx> {
    world[idA] ^= world[idB]
    world[idB] ^= world[idA]
    world[idA] ^= world[idB]
    return [idA, idB]
}

export const get = (): World => world

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

export const applyPainting = (): Idx | undefined => {
    if (paintingIndex) {
        const changed = spawn(paintingIndex, paintingMateria)
        if (changed) {
            return changed
        }
    }
}
