
import "reflect-metadata";
import {Serializer} from "./Serializer";
import {AnyType} from "ts-essentials/target/build/main/lib/inflection";
import {
    AnnotatedSerializableProperties,
    AnnotatedIgnoreSerializationProperties,
    SerializableType,
    Serializer as SerializerDecorator
} from "./SerializerDecorator";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export class JsonSerializer implements Serializer {
    public serialize(value: any): string {
        if (value === null) {
            return null;
        }

        if (typeof value !== "object") {
            return JSON.stringify(value);
        }

        const ignored = this.getIgnoredProperties(value);

        return JSON.stringify(value, (name: string, value: any): any => {
            return (ignored.indexOf(name) > -1) ? undefined : value;
        });
    }

    public deserialize(data: string, type?: AnyType): any {
        if (!type) {
            return JSON.parse(data);
        }

        const instance = new type();
        const dataObject = JSON.parse(data, (name: string, value: any): any => {
            if (name === "") {
                return value;
            }

            const serializableType = this.getSerializableType(instance, name);

            if (serializableType === null || serializableType.primaryType === null || typeof value !== "object") {
                return value;
            }

            if (
                ClassNameInflector.className(serializableType.primaryType) === "Array" &&
                serializableType.secondaryType !== null
            ) {
                const propertyInstance = new serializableType.primaryType();

                for (let i = 0; i < value.length; i++) {
                    const itemInstance = new serializableType.secondaryType();
                    this.hydrate(itemInstance, value[i]);
                    propertyInstance.push(itemInstance);
                }

                return propertyInstance;
            }

            return this.deserialize(this.serialize(value), serializableType.primaryType);
        });

        this.hydrate(instance, dataObject);
        return instance;
    }

    private hydrate(object: Object, data: Object) {
        for (const property in data) {
            object[property] = data[property];
        }
    }

    private getSerializableType(target: Object, propertyName: string): SerializableType {
        const propertyTypes: AnnotatedSerializableProperties =
            Reflect.getMetadata(SerializerDecorator.SERIALIZABLE_PROPERTIES, target) || {};

        if (!propertyTypes[propertyName]) {
            return null;
        }

        return propertyTypes[propertyName];
    }

    private getIgnoredProperties(value: Object): AnnotatedIgnoreSerializationProperties {
        return Reflect.getMetadata(SerializerDecorator.IGNORE_SERIALIZATION_PROPERTIES, value) || [];
    }
}
