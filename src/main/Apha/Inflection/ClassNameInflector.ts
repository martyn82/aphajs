
import {InflectionException} from "./InflectionException";

type AnyType = {new(...args: any[]): any};

export class ClassNameInflector {
    private static pattern = /function (.{1,})\(/;

    public static classOf(object: Object): string {
        if (typeof object !== "object") {
            throw new InflectionException("Unable to inflect class name of a non-object.");
        }

        return ClassNameInflector.pattern.exec((<any>object).constructor.toString())[1];
    }

    public static className(type: AnyType): string {
        return ClassNameInflector.pattern.exec(type.toString())[1];
    }
}
