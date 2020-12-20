import { materiaPhysics } from './physics.js'

let width = 0
let height = 0
let world = []
let lastTouched = []

// https://blog.usejournal.com/structurae-data-structures-for-high-performance-javascript-9b7da4c73f8
function init(w, h) {
    width = w
    height = h
    for (let i = 0; i < w * h; i++) {
        world[i] = 0
        lastTouched.push(i)
    }
    return world
}

const is = (id, val) => world[id] === val
const down = id => id + width
const up = id => id - width
const right = id => id + 1
const left = id => id - 1

const swap = (idA, idB) => {
    const matA = world[idA]
    const matB = world[idB]

    world[idA] = matB
    world[idB] = matA
}

const get = () => world

let tickNb = 0
function tick() {
    let currentChange = []
    for (let i of lastTouched) {
        if (!currentChange.includes(i)) {
            if (materiaPhysics[world[i]]) {
                currentChange = currentChange.concat(materiaPhysics[world[i]](i))
            }
        }
    }
    if (tickNb < 100 && tickNb > 0) {
        world[100] = 3
        world[50] = 2
        currentChange.push(100, 50)
    }

    tickNb += 1
    lastTouched = currentChange
    return currentChange
}


export {init, get, tick, is, down, up, right, left, swap}
