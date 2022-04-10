import {minmax} from "crux/dist/utils/math";
// find the valid bound
export function findUpperBoundDec(x, sigDigit, power = 0) {
    if (x < 0) {
        console.error("Bound must be positive value");
        return;
    }
    if (x === 0) return 0;
    if (x < Math.pow(10, sigDigit - 1))
        return findUpperBoundDec(10 * x, sigDigit, power + 1);
    else {
        const numTen = 10 * Math.floor(x / 10);
        const dig = x - numTen;
        return (numTen + (dig > 5 ? 10 : dig === 0 ? 0 : 5)) / Math.pow(10, power);
    }
}

export function findLowerBoundDec(x, sigDigit, power = 0) {
    if (x < 0) {
        console.error("Bound must be positive value");
        return;
    }
    if (x === 0) return 0;
    if (x < Math.pow(10, sigDigit - 1))
        return findLowerBoundDec(10 * x, sigDigit, power + 1);
    else
        return Math.floor(x) / Math.pow(10, power);
}

export function findUpperBound(x: number, sigDigit: number = 2): number {
    if (x < 1)
        return findUpperBoundDec(x, sigDigit);
    return parseFloat(Math.ceil(x).toPrecision(sigDigit));
}

export function findLowerBound(x: number, sigDigit: number = 2): number {
    if (x < 1)
        return findLowerBoundDec(x, sigDigit);
    return parseFloat(Math.floor(x).toPrecision(sigDigit));
}

export function computeLog(number, base = 10): number {
    return Math.log(number) / Math.log(base);
}

export function findBoundsForValues(values: number[], sigDigit: number,
                                    isSym: boolean= false, padding: number = 0) {
    let [min, max] = minmax(values);
    if (padding !== 0) {
        const range = max - min;
        min = min - range * padding;
        max = max + range * padding;
    }
    let lowerBound, upperBound;
    if (min < 0 && max > 0) {
        if (isSym) {
            const bound = findUpperBound( max > -min ? max : -min , sigDigit);
            return [-bound, bound];
        } else {
            upperBound = findUpperBound(max, sigDigit);
            lowerBound = Math.sign(min) * findUpperBound(Math.abs(min), sigDigit);
        }
    } else if (max > 0) {
        upperBound = findUpperBound(max, sigDigit);
        lowerBound = findLowerBound(min, sigDigit);
    } else if (max < 0) {
        upperBound = -findLowerBound(-max, sigDigit);
        lowerBound = findLowerBound(min, sigDigit);
    }
    return [lowerBound, upperBound];
}
