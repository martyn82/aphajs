
export type AnyType = {new(...args: any[]): any};

export interface Serializer {
    serialize(value: any): string;
    deserialize(data: string, type?: AnyType): any;
}
