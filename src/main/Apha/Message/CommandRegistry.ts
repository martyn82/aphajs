
import {MessageRegistry} from "./MessageRegistry";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {CommandType} from "./Command";

export class CommandRegistry implements MessageRegistry<CommandType> {
    private messages: Map<string, CommandType>;

    constructor() {
        this.messages = new Map<string, CommandType>();
    }

    public register(message: CommandType): void {
        if (this.exists(message)) {
            return;
        }

        const className = ClassNameInflector.className(message);
        this.messages.set(className, message);
    }

    public unregister(message: CommandType): void {
        if (!this.exists(message)) {
            return;
        }

        const className = ClassNameInflector.className(message);
        this.messages.delete(className);
    }

    public entries(): IterableIterator<CommandType> {
        return this.messages.values();
    }

    public find(className: string): CommandType {
        if (!this.messages.has(className)) {
            return null;
        }

        return this.messages.get(className);
    }

    public exists(message: CommandType): boolean {
        const className = ClassNameInflector.className(message);
        return this.messages.has(className);
    }
}
