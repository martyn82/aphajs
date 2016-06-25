
import "reflect-metadata";
import {AggregateRoot} from "./AggregateRoot";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {FQN_METADATA_KEY} from "../Message/Message";

export type AggregateRootType = {new(...args: any[]): AggregateRoot};

export class AggregateRootInitializer {
    private static messages: Map<string, Set<string>> = new Map<string, Set<string>>();

    public static reset(): void {
        AggregateRootInitializer.messages = new Map<string, Set<string>>();
    }

    public static initialize(target: AggregateRootType): void {
        const instance = new target();
        AggregateRootInitializer.annotateMessages(instance);
    }

    private static annotateMessages(aggregate: AggregateRoot): void {
        const ownName = ClassNameInflector.classOf(aggregate);

        if (!AggregateRootInitializer.messages.has(ownName)) {
            const messages = new Set<string>();

            for (const item in aggregate.constructor) {
                if (aggregate.constructor.hasOwnProperty(item)) {
                    const fqn = ClassNameInflector.className(aggregate.constructor[item], aggregate.constructor);
                    Reflect.defineMetadata(FQN_METADATA_KEY, fqn, aggregate.constructor[item]);
                    messages.add(fqn);
                }
            }

            AggregateRootInitializer.messages.set(ownName, messages);
        }
    }
}
