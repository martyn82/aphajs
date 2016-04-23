
export interface Serializer {
    serialize(value: any): string;
    deserialize(data: string, type?: {new(): any}): any;
}
