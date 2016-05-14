
import "reflect-metadata";
import {AnyType} from "../Serializer";

export namespace Serializer {
    export function Ignore(target: Object, propertyName: string, descriptor: TypedPropertyDescriptor): void {
        let propertyType = Reflect.getMetadata();
    }

    export function Type(type?: AnyType): Function {
        return (
            target: Object,
            propertyName: string,
            descriptor: TypedPropertyDescriptor
        ): void => {

        }
    }
}
