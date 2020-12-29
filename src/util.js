const halfChance = () => Math.random() > 0.5

const scramble = (a, b) => halfChance() ? [a, b] : [b, a]

const randBetween = (a, b) => Math.ceil(Math.random() * (b - a) + a)

export { scramble, randBetween }
