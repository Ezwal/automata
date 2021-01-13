import { props } from './materia.js'

let width = 0
let height = 0
let world = []
let lastTouched = []

// https://blog.usejournal.com/structurae-data-structures-for-high-performance-javascript-9b7da4c73f8
export const init = (w, h) => {
    width = w
    height = h
    for (let i = 0; i < w * h; i++) {
        world[i] = 0
        lastTouched.push(i)
    }
    return world
}

export const is = (id, val) => world[id] === val
export const at = id => world[id]
export const down = id => id + width
export const up = id => id - width
export const right = id => id % (width - 1) !== 0 ? id + 1 : -1
export const left = id => id % width !== 0 ? id - 1 : -1

let paintingIndex
let paintingMateria
export const paint = (x, y, materia) => {
    const offset = x + y * width
    paintingIndex = offset
    paintingMateria = materia
}
export const stopPainting = () => {
    paintingIndex = undefined
}

export const spawn = (offset, materia) => {
    if (offset >= 0 && offset < world.length) {
        world[offset] = materia
        return offset
    }
}

export const swap = (idA, idB) => {
    const matA = world[idA]
    const matB = world[idB]

    world[idA] = matB
    world[idB] = matA
    return [idA, idB]
}

export const get = () => world

let tickNb = 0
export function tick() {
    let currentChange = []
    for (let i of lastTouched) {
        if (!currentChange.includes(i)) {
            const physic = props[at(i)].physic
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

