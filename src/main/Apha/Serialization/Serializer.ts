
import {AnyType} from "ts-essentials/target/build/main/lib/inflection";

export interface Serializer {
    serialize(value: any): string;
    deserialize(data: string, type?: AnyType): any;
}
