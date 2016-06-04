
import "reflect-metadata";
import {AnyType} from "../../Inflect";
import {MetadataKeys} from "../Decorators/MetadataKeys";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {DecoratorException} from "../Decorators/DecoratorException";

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
    export const IGNORE_SERIALIZATION_PROPERTIES = "annotations:serialize:ignore";
    export const SERIALIZABLE_PROPERTIES = "annotations:serializables";

    export function Ignore(): Function {
        return (target: Object, propertyName: string): void => {
            if (!propertyName) {
                throw new DecoratorException(ClassNameInflector.classOf(target), propertyName, "Serializer.Ignore");
            }

            const ignores: AnnotatedIgnoreSerializationProperties =
                Reflect.getMetadata(IGNORE_SERIALIZATION_PROPERTIES, target) || [];

            ignores.push(propertyName);
            Reflect.defineMetadata(IGNORE_SERIALIZATION_PROPERTIES, ignores, target);
        }
    }

    export function Serializable(options?: SerializableTypeOptions): Function {
        return (target: Object, propertyName: string): void => {
            if (!propertyName) {
                throw new DecoratorException(
                    ClassNameInflector.classOf(target),
                    propertyName,
                    "Serializer.Serializable"
                );
            }

            const propertyType: AnyType = Reflect.getMetadata(MetadataKeys.PROPERTY_TYPE, target, propertyName);
            const serializableType: SerializableType = {
                primaryType: undefined
            };

            if (ClassNameInflector.className(propertyType) === "Array" && options && options.genericType) {
                serializableType.primaryType = propertyType;
                serializableType.secondaryType = options.genericType;
            } else {
                serializableType.primaryType = propertyType;
            }

            const serializables: AnnotatedSerializableProperties =
                Reflect.getMetadata(SERIALIZABLE_PROPERTIES, target) || {};

            serializables[propertyName] = serializableType;
            Reflect.defineMetadata(SERIALIZABLE_PROPERTIES, serializables, target);
        }
    }
}
