const materia = Object.freeze({
    air: 0,
    ground: 1,
    water: 2,
    sand: 3,
})

const materiaColor = Object.freeze({
    [materia.air]: [255, 255, 255],
    [materia.ground]: [0, 0, 0],
    [materia.water]: [0, 15, 255],
    [materia.sand]: [244, 217, 14],
})

const is = (id, mat) => world[id] === mat

let world = []
let width
let height

function initWorld(w, h) {
    width = w
    height = h
    for (let i = 0; i < w * h; i++) {
        world.push(materia.air)
        if (i == 125 || i == 125 + width || i == 125 + 2 *width) {
            world.push(materia.water)
        }
    }
    return world
}

function sandPhysics(center) {
    let changed = []
    if (is(center + width, materia.air)) {
        world[center + width] = materia.sand
        world[center] = materia.air
        changed.push(center, center+width)
    } else if (is(center + width - 1, materia.air)) {
        world[center + width - 1] = materia.sand
        world[center] = materia.air
        changed.push(center, center+width-1)
    } else if (is(center + width + 1, materia.air)) {
        world[center + width + 1] = materia.sand
        world[center] = materia.air
        changed.push(center, center+width+1)
    }
    return changed
}

function waterPhysics(center) {
    let changed = []
    if (is(center + width, materia.air)) {
        world[center + width] = materia.water
        world[center] = materia.air
        changed.push(center, center+width)
    } else if (is(center + width - 1, materia.air)) {
        world[center + width - 1] = materia.water
        world[center] = materia.air
        changed.push(center, center+width-1)
    } else if (is(center + width + 1, materia.air)) {
        world[center + width + 1] = materia.water
        world[center] = materia.air
        changed.push(center, center+width+1)
    } else if (is(center + width, materia.water) && is(center - 1, materia.air)) {
        world[center-1] = materia.water
        world[center] = materia.air
        changed.push(center, center-1)
    } else if (is(center + width, materia.water) && is(center + 1, materia.air)) {
        world[center+1] = materia.water
        world[center] = materia.air
        changed.push(center, center+1)
    }
    return changed
}

let i = 0
function tickWorld() {
    let changed = []
    for (let i = 0; i < world.length; i ++) {
        if (!changed.includes(i)) {
            if (is(i, materia.water)) {
                changed = changed.concat(waterPhysics(i))
            }
        }
    }
    // https://blog.usejournal.com/structurae-data-structures-for-high-performance-javascript-9b7da4c73f8
    if (i < 100) {
        world[125] = materia.water
        changed.push(125)
        i++
    }
    return [world, changed]
}

export {
    initWorld, tickWorld, materiaColor
}
