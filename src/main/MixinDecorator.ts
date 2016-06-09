
export function Mixin(...baseTypes: Function[]): Function {
    return (target: Function): void => {
        applyMixins(target, baseTypes);
    };
}

function applyMixins(derivedType: Function, baseTypes: Function[]): void {
    baseTypes.forEach(baseType => {
        Object.getOwnPropertyNames(baseType.prototype).forEach(name => {
            derivedType.prototype[name] = baseType.prototype[name];
        });
    });
}
