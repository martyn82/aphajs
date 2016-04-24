
import {CommandHandler} from "./CommandHandler";
import {Command} from "../Message/Command";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {UnsupportedCommandException} from "./UnsupportedCommandException";

export abstract class TypedCommandHandler implements CommandHandler {
    public handle(command: Command): void {
        this.handleByInflection(command);
    }

    private handleByInflection(command: Command): void {
        let commandClass = ClassNameInflector.classOf(command);
        let handler = this["handle" + commandClass];

        if (typeof handler !== "function") {
            throw new UnsupportedCommandException(commandClass);
        }

        handler.call(this, command);
    }
}
