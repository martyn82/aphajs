
import {CommandHandler} from "./CommandHandler";
import {Command} from "../Message/Command";
import {UnsupportedCommandException} from "./UnsupportedCommandException";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export abstract class TypedCommandHandler implements CommandHandler {
    public async handle(command: Command): Promise<void> {
        return this.handleByInflection(command);
    }

    private async handleByInflection(command: Command): Promise<void> {
        const commandClass = ClassNameInflector.classOf(command);
        const handler = this["handle" + commandClass];

        if (typeof handler !== "function") {
            throw new UnsupportedCommandException(commandClass);
        }

        return handler.call(this, command);
    }
}
