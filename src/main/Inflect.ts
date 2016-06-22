
export type AnyType = {new(...args: any[]): any};

export namespace Inflect {
    export function classOf(object: Object, context?: any): string {
        if (typeof object !== "object") {
            return "";
        }

        return className(<AnyType>object.constructor, context);
    }

    export function className(type: AnyType, context?: any): string {
        if (context) {
            return [context.name, type.name].join("$");
        }

        return type.name;
    }
}
