
import {CommandBus} from "./CommandBus";
import {CommandHandler} from "./CommandHandler";
import {Command, CommandType} from "../Message/Command";
import {CommandHandlerAlreadyExistsException} from "./CommandHandlerAlreadyExistsException";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {NoCommandHandlerException} from "./NoCommandHandlerException";

export class SimpleCommandBus extends CommandBus {
    private handlers: Map<string, CommandHandler> = new Map<string, CommandHandler>();

    public registerHandler(commandType: CommandType, handler: CommandHandler) {
        const commandClass = ClassNameInflector.className(commandType);

        if (this.handlers.has(commandClass)) {
            throw new CommandHandlerAlreadyExistsException(commandClass);
        }

        this.handlers.set(commandClass, handler);
    }

    public unregisterHandler(commandType: CommandType) {
        const commandClass = ClassNameInflector.className(commandType);

        if (!this.handlers.has(commandClass)) {
            return;
        }

        this.handlers.delete(commandClass);
    }

    public send(command: Command) {
        const commandClass = ClassNameInflector.classOf(command);

        if (!this.handlers.has(commandClass)) {
            throw new NoCommandHandlerException(commandClass);
        }

        this.handlers.get(commandClass).handle(command);
    }
}
