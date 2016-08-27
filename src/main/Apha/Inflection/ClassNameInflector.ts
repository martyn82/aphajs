
import {classOf as inflectClassOf, className as inflectClassName, AnyType} from "ts-essentials/target/build/main/lib/inflection";
import {InflectionException} from "./InflectionException";

export class ClassNameInflector {
    public static classOf(object: Object, context?: any): string {
        const name = inflectClassOf(object, context);

        if (name === "") {
            throw new InflectionException("Unable to inflect class name of a non-object.");
        }

        return name;
    }

    public static className(type: AnyType, context?: any): string {
        return inflectClassName(type, context);
    }
}
