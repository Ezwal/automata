import { getProps } from './properties.js'

type Idx = number
type World = number[]

let width = 0
let height = 0
let world: World = []
let lastTouched = []

// https://blog.usejournal.com/structurae-data-structures-for-high-performance-javascript-9b7da4c73f8
export function init(w: number, h: number): World {
    width = w
    height = h
    for (let i = 0; i < w * h; i++) {
        world[i] = 0
        lastTouched.push(i)
    }
    return world
}

export const is = (id: Idx, val: number): boolean => world[id] === val
export const at = id => world[id]
export const down = (id: Idx): Idx => id + width
export const up = (id: Idx) => id - width
export const right = (id: Idx): Idx => id % (width - 1) !== 0 ? id + 1 : -1
export const left = (id: Idx): Idx => id % width !== 0 ? id - 1 : -1

let paintingIndex
let paintingMateria
export const paint = (x: number, y: number, materia: number) => {
    const offset = x + y * width
    paintingIndex = offset
    paintingMateria = materia
}
export const stopPainting = () => {
    paintingIndex = undefined
}

export function spawn(idx: Idx, materia: number) {
    if (idx >= 0 && idx < world.length) {
        world[idx] = materia
        return idx
    }
}

export function swap(idA: Idx, idB: Idx): Idx[] {
    const matA = world[idA]
    const matB = world[idB]

    world[idA] = matB
    world[idB] = matA
    return [idA, idB]
}

export const get = (): World => world

let tickNb = 0
export function tick() {
    let currentChange = []
    for (let i of lastTouched) {
        if (!currentChange.includes(i)) {
            const physic = getProps(at(i)).physic
            if (physic) {
                currentChange = currentChange.concat(physic(i))
            }
        }
    }
    if (tickNb < 200 && tickNb > 0) {
        world[100] = 3
        world[78] = 2
        currentChange.push(100, 78)
    }
    if (paintingIndex) {
        currentChange.push(spawn(paintingIndex, paintingMateria))
    }

    tickNb += 1
    lastTouched = currentChange
    return currentChange
}

