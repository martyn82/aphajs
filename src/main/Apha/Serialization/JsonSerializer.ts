
import "reflect-metadata";
import {Serializer} from "./Serializer";
import {AnyType} from "../../Inflect";
import {
    AnnotatedSerializableProperties,
    AnnotatedIgnoreSerializationProperties
} from "../Decorators/SerializerDecorator";
import {MetadataKeys} from "../Decorators/MetadataKeys";

export class JsonSerializer implements Serializer {
    public serialize(value: any): string {
        if (value === null) {
            return "";
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
            let typeInstance = new type();
            let propertyType = this.getPropertyType(typeInstance, name);

            if (propertyType === null) {
                return value;
            }

            let object = new propertyType();
            this.hydrate(object, value);
            return object;
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

    private getPropertyType(target: Object, propertyName: string): AnyType {
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
