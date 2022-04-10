export function copyObject(obj: any) {
    const result = {};
    Object.entries(obj).forEach(([k, v]) => result[k] = v);
    return result;
}
