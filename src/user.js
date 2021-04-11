import { paint, stopPainting } from './world.js'
import materia from './materia.js'
import { propsList, getProps } from './properties.js'

const canvas = document.getElementById('mainCanvas')

const materiaKeyCode = Object.keys(propsList)
                             .reduce((keyToMateria, el) => ({
                                 [getProps(el).key]: Number(el),
                                 ...keyToMateria
                             }), {})

function handleClick() {
    let painting = undefined
    let currentPaintingMateria = 2

    canvas.addEventListener('mousedown', e => {
        if (e.buttons === 1) {
            console.log('start painting', e.offsetX, e.offsetY)
            painting = 1
        }
    })
    canvas.addEventListener('mousemove', e => {
        if (painting) {
            paint(e.offsetX, e.offsetY, currentPaintingMateria)
        }
    })
    canvas.addEventListener('mouseup', e => {
        if (e.buttons === 0) {
            painting = false
            stopPainting()
            console.log('stopped painting');
        }
    })

    document.addEventListener('keydown', e => {
        if (materiaKeyCode[e.key]) {
            currentPaintingMateria = materiaKeyCode[e.key]
        }
    })
}

export default handleClick
