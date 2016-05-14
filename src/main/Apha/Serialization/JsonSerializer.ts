
import "reflect-metadata";
import {Serializer} from "./Serializer";
import {AnyType} from "../../Inflect";
import {
    AnnotatedSerializableProperties,
    AnnotatedIgnoreSerializationProperties, SerializableType
} from "../Decorators/SerializerDecorator";
import {MetadataKeys} from "../Decorators/MetadataKeys";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export class JsonSerializer implements Serializer {
    public serialize(value: any): string {
        if (value === null) {
            return null;
        }

        if (typeof value !== "object") {
            return JSON.stringify(value);
        }

        let ignored = this.getIgnoredProperties(value);
        return JSON.stringify(value, (name: string, value: any): any => {
            return (ignored.indexOf(name) > -1) ? undefined : value;
        });
    }

    public deserialize(data: string, type?: AnyType): any {
        if (!type) {
            return JSON.parse(data);
        }

        let instance = new type();
        let dataObject = JSON.parse(data, (name: string, value: any): any => {
            if (name === "") {
                return value;
            }

            let serializableType = this.getSerializableType(instance, name);

            if (serializableType === null || serializableType.primaryType === null || typeof value !== "object") {
                return value;
            }

            let propertyInstance = new serializableType.primaryType();

            if (
                ClassNameInflector.className(serializableType.primaryType) === "Array" &&
                serializableType.secondaryType !== null
            ) {
                for (let i = 0; i < value.length; i++) {
                    let itemInstance = new serializableType.secondaryType();
                    this.hydrate(itemInstance, value[i]);
                    propertyInstance.push(itemInstance);
                }
            } else {
                this.hydrate(propertyInstance, value);
            }

            return propertyInstance;
        });

        this.hydrate(instance, dataObject);
        return instance;
    }

    private hydrate(object: Object, data: Object) {
        for (let property in data) {
            if (object.hasOwnProperty(property)) {
                object[property] = data[property];
            }
        }
    }

    private getSerializableType(target: Object, propertyName: string): SerializableType {
        let propertyTypes: AnnotatedSerializableProperties =
            Reflect.getMetadata(MetadataKeys.SERIALIZABLE_PROPERTIES, target) || {};

        if (!propertyTypes[propertyName]) {
            return null;
        }

        return propertyTypes[propertyName];
    }

    private getIgnoredProperties(value: Object): AnnotatedIgnoreSerializationProperties {
        return Reflect.getMetadata(MetadataKeys.IGNORE_SERIALIZATION_PROPERTIES, value) || [];
    }
}
