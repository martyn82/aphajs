
import {AnyType} from "../../Inflect";

export interface Serializer {
    serialize(value: any): string;
    deserialize(data: string, type?: AnyType): any;
}
