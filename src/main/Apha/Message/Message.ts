
import "reflect-metadata";

export const FQN_METADATA_KEY = "fqn";

export type MessageType = {new(...args: any[]): Message};

export abstract class Message {
    public get fullyQualifiedName(): string {
        return Reflect.getOwnMetadata(FQN_METADATA_KEY, this.constructor) || this.constructor.name;
    }

    public static fqn(type: MessageType): string {
        const instance = new type();
        return instance.fullyQualifiedName;
    }
}
