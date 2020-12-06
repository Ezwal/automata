const materia = Object.freeze({
    air: 0,
    ground: 1,
    water: 2
})

const materiaColor = Object.freeze({
    [materia.air]: [255, 255, 255],
    [materia.ground]: [0, 0, 0],
    [materia.water]: [0, 0, 255],
})

const is = (id, mat) => world[id] === mat

let world = []
let width
let height

function initWorld(w, h) {
    width = w
    height = h
    for (let i = 0; i < w * h; i++) {
        world[i] = materia.air
        if (i === 125) {
            world[i] = materia.water
        }
    }
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
    }
    return changed
}

function tickWorld() {
    let changed = []
    for (let i = 0; i < world.length; i ++) {
        if (!changed.includes(i)) {
            if (is(i, materia.water)) {
                changed = changed.concat(waterPhysics(i))
            }
        }
    }
    console.log('changed', changed);
    console.log('world', world);
    return [world, changed]
}

export {
    initWorld, tickWorld, materiaColor
}
