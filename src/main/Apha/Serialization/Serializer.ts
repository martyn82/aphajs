
export interface Serializer {
    serialize(value: any): string;
    deserialize(data: string, type?: {new(...args: any[]): any}): any;
}
