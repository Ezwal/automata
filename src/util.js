const halfChance = () => Math.random() > 0.5

export const scramble = (a, b) => halfChance() ? [a, b] : [b, a]

export const randBetween = (a, b) => Math.ceil(Math.random() * (b - a) + a)

export function range(start, end) {
    var acc = [];
    for (let i = start; i <= end; i++) {
        acc.push(i);
    }
    return acc;
}
