
import {Inflect, AnyType} from "./../../Inflect";
import {InflectionException} from "./InflectionException";

export class ClassNameInflector {
    public static classOf(object: Object, context?: any): string {
        const name = Inflect.classOf(object, context);

        if (name === "") {
            throw new InflectionException("Unable to inflect class name of a non-object.");
        }

        return name;
    }

    public static className(type: AnyType, context?: any): string {
        return Inflect.className(type, context);
    }
}
