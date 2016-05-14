
import "reflect-metadata";
import {AnyType} from "../../Inflect";
import {MetadataKeys} from "./MetadataKeys";

export type AnnotatedIgnoreSerializationProperties = string[];
export type AnnotatedSerializableProperties = {[propertyName: string]: AnyType};

export namespace Serializer {
    export function Ignore(): Function {
        return (target: Object, propertyName: string): void => {
            let ignores: AnnotatedIgnoreSerializationProperties =
                Reflect.getOwnMetadata(MetadataKeys.IGNORE_SERIALIZATION_PROPERTIES, target) || [];

            ignores.push(propertyName);
            Reflect.defineMetadata(MetadataKeys.IGNORE_SERIALIZATION_PROPERTIES, ignores, target);
        }
    }

    export function Serializable(): Function {
        return (target: Object, propertyName: string): void => {
            let propertyType = Reflect.getMetadata(MetadataKeys.PROPERTY_TYPE, target, propertyName);
            let serializables: AnnotatedSerializableProperties =
                Reflect.getOwnMetadata(MetadataKeys.SERIALIZABLE_PROPERTIES, target) || {};

            serializables[propertyName] = propertyType;
            Reflect.defineMetadata(MetadataKeys.SERIALIZABLE_PROPERTIES, serializables, target);
        }
    }
}
