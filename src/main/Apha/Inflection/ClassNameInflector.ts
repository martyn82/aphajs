
import {InflectionException} from "./InflectionException";

export class ClassNameInflector {
    private static pattern = /function (.{1,})\(/;

    public static classOf(object: Object): string {
        if (typeof object !== "object") {
            throw new InflectionException("Unable to inflect class name of a non-object.");
        }

        return ClassNameInflector.pattern.exec((<any>object).constructor.toString())[1];
    }

    public static className(ctor: {new(): any}): string {
        return ClassNameInflector.pattern.exec(ctor.toString())[1];
    }
}
