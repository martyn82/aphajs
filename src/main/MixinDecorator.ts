
import {AnyType} from "./Inflect";

export function Mixin(...baseTypes: Function[]): Function {
    return (constructor: Function): void => {
        applyMixins(constructor, baseTypes);
    };
}

function applyMixins(derivedType: Function, baseTypes: Function[]): void {
    baseTypes.forEach(baseType => {
        Object.getOwnPropertyNames(baseType.prototype).forEach(name => {
            derivedType.prototype[name] = baseType.prototype[name];
        });
    });
}
