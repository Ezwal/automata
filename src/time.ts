import { Idx, spawn, spawnByName, applyPainting } from './world'
import { sim } from './physics';

let lastTouched: Set<Idx> = new Set()

let tickNb = 0
export function tick(): Set<Idx> {
    let currentChange: Set<Idx> = new Set()
    for (let i of lastTouched) {
        if (!currentChange.has(i)) {
            const touched = sim(i)
            touched.forEach(el => currentChange.add(el))
        }
    }
    if (tickNb < 100 && tickNb > 0) {
        currentChange.add(spawnByName(90, 'water'))
        currentChange.add(spawnByName(78, 'sand'))
    }
    const paintIndex = applyPainting()
    if (paintIndex) currentChange.add(paintIndex)

    tickNb += 1
    lastTouched = currentChange
    return currentChange
}
