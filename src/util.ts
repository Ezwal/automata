const halfChance = (): boolean => Math.random() > 0.5

export const scramble = (a: any, b: any): any[] => halfChance() ? [a, b] : [b, a]

export const randBetween = (a: number, b: number): number => Math.ceil(Math.random() * (b - a) + a)

export function range(start: number, end: number): Array<number> {
    var acc = [];
    for (let i = start; i <= end; i++) {
        acc.push(i);
    }
    return acc;
}
