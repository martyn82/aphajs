
export type AnyType = {new(...args: any[]): any};

export namespace Inflect {
    export function classOf(object: Object): string {
        if (typeof object !== "object") {
            return "";
        }

        return object.constructor.name;
    }

    export function className(type: AnyType): string {
        return type.name;
    }
}
