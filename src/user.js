import { paint, stopPainting } from './world.js'

const canvas = document.getElementById('mainCanvas')

const materiaKeyCode = Object.freeze({
    'g': 1,
    'w': 2,
    's': 3,
})

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
    canvas.addEventListener('mousedown', e => {
        if (e.buttons === 4) {
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
