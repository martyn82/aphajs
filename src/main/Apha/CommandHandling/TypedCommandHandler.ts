
import {CommandHandler} from "./CommandHandler";
import {Command} from "../Message/Command";
import {UnsupportedCommandException} from "./UnsupportedCommandException";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export abstract class TypedCommandHandler implements CommandHandler {
    public async handle(command: Command): Promise<void> {
        this.handleByInflection(command);
    }

    private handleByInflection(command: Command): void {
        const commandClass = ClassNameInflector.classOf(command);
        const handler = this["handle" + commandClass];

        if (typeof handler !== "function") {
            throw new UnsupportedCommandException(commandClass);
        }

        handler.call(this, command);
    }
}
