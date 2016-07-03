
import {CommandBus} from "./CommandBus";
import {CommandHandler} from "./CommandHandler";
import {Command, CommandType} from "../Message/Command";
import {CommandHandlerAlreadyExistsException} from "./CommandHandlerAlreadyExistsException";
import {NoCommandHandlerException} from "./NoCommandHandlerException";
import {Message} from "../Message/Message";

export class SimpleCommandBus extends CommandBus {
    private handlers: Map<string, CommandHandler> = new Map<string, CommandHandler>();

    public registerHandler(commandType: CommandType, handler: CommandHandler) {
        const commandClass = Message.fqn(commandType);

        if (this.handlers.has(commandClass)) {
            throw new CommandHandlerAlreadyExistsException(commandClass);
        }

        this.handlers.set(commandClass, handler);
    }

    public unregisterHandler(commandType: CommandType) {
        const commandClass = Message.fqn(commandType);

        if (!this.handlers.has(commandClass)) {
            return;
        }

        this.handlers.delete(commandClass);
    }

    public async send(command: Command): Promise<void> {
        const commandClass = command.fullyQualifiedName;

        if (!this.handlers.has(commandClass)) {
            throw new NoCommandHandlerException(commandClass);
        }

        return this.handlers.get(commandClass).handle(command);
    }
}
