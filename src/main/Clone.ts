
import {AnyType} from "./Inflect";

export function clone(obj: any, target?: any): any {
    let copy;

    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    if (obj instanceof Array) {
        copy = [];

        for (let i = 0; i < obj.length; i++) {
            copy[i] = obj[i];
        }

        return copy;
    }

    if (target) {
        copy = target;
    } else {
        copy = {};
    }

    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = clone(obj[prop]);
        }
    }

    return copy;
}
