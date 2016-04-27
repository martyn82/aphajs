
import {Serializer} from "./Serializer";

export class JsonSerializer implements Serializer {
    public serialize(value: any): string {
        return JSON.stringify(value);
    }

    public deserialize(data: string, type?: {new(...args: any[]): any}): any {
        let deserialized = JSON.parse(data);

        if (type) {
            let obj = new type();
            return this.hydrate(obj, deserialized);
        }

        return deserialized;
    }

    private hydrate(obj: any, data: Object): any {
        for (let p in data) {
            if (obj.hasOwnProperty(p)) {
                obj[p] = data[p];
            }
        }

        return obj;
    }
}
