
import {Inflect, AnyType} from "./../../Inflect";
import {InflectionException} from "./InflectionException";

export class ClassNameInflector {
    public static classOf(object: Object): string {
        let name = Inflect.classOf(object);

        if (name === "") {
            throw new InflectionException("Unable to inflect class name of a non-object.");
        }

        return name;
    }

    public static className(type: AnyType): string {
        return Inflect.className(type);
    }
}
