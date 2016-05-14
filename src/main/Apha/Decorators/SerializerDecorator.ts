
import "reflect-metadata";
import {AnyType} from "../../Inflect";
import {MetadataKeys} from "./MetadataKeys";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export type AnnotatedIgnoreSerializationProperties = string[];
export type SerializableType = {
    primaryType: AnyType,
    secondaryType?: AnyType
};
export type AnnotatedSerializableProperties = {[propertyName: string]: SerializableType};
export type SerializableTypeOptions = {
    genericType?: AnyType
};

export namespace Serializer {
    export function Ignore(): Function {
        return (target: Object, propertyName: string): void => {
            let ignores: AnnotatedIgnoreSerializationProperties =
                Reflect.getOwnMetadata(MetadataKeys.IGNORE_SERIALIZATION_PROPERTIES, target) || [];

            ignores.push(propertyName);
            Reflect.defineMetadata(MetadataKeys.IGNORE_SERIALIZATION_PROPERTIES, ignores, target);
        }
    }

    export function Serializable(options?: SerializableTypeOptions): Function {
        return (target: Object, propertyName: string): void => {
            let propertyType: AnyType = Reflect.getMetadata(MetadataKeys.PROPERTY_TYPE, target, propertyName);
            let serializableType: SerializableType = {
                primaryType: undefined
            };

            if (ClassNameInflector.className(propertyType) === "Array" && options && options.genericType) {
                serializableType.primaryType = propertyType;
                serializableType.secondaryType = options.genericType;
            } else {
                serializableType.primaryType = propertyType;
            }

            let serializables: AnnotatedSerializableProperties =
                Reflect.getOwnMetadata(MetadataKeys.SERIALIZABLE_PROPERTIES, target) || {};

            serializables[propertyName] = serializableType;
            Reflect.defineMetadata(MetadataKeys.SERIALIZABLE_PROPERTIES, serializables, target);
        }
    }
}
