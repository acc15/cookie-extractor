
export function shallowEq(obj1: {[k: string]: any}, obj2: {[k: string]: any}): boolean {
    const keys = new Set(Object.keys(obj1).concat(Object.keys(obj2)));
    for (const k of keys) {
        if (obj1[k] !== obj2[k]) {
            return false;
        }
    }
    return true;
}