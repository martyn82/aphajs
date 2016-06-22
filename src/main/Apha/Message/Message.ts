
import "reflect-metadata";

export const FQN_METADATA_KEY = "fqn";

export abstract class Message {
    public get fullyQualifiedName(): string {
        return Reflect.getOwnMetadata(FQN_METADATA_KEY, this.constructor) || this.constructor.name;
    }
}
