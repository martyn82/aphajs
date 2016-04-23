
import {CommandBus} from "./CommandBus";
import {CommandHandler} from "./CommandHandler";
import {Command} from "../Message/Command";
import {CommandHandlerAlreadyExistsException} from "./CommandHandlerAlreadyExistsException";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {NoCommandHandlerException} from "./NoCommandHandlerException";

export class SimpleCommandBus extends CommandBus {
    private handlers: {[commandClass: string]: CommandHandler} = {};

    public registerHandler(commandType: {new(): Command}, handler: CommandHandler) {
        let commandClass = ClassNameInflector.className(commandType);

        if (this.handlers[commandClass]) {
            throw new CommandHandlerAlreadyExistsException(commandClass);
        }

        this.handlers[commandClass] = handler;
    }

    public unregisterHandler(commandType: {new(): Command}) {
        let commandClass = ClassNameInflector.className(commandType);

        if (!this.handlers[commandClass]) {
            return;
        }

        delete this.handlers[commandClass];
    }

    public send(command: Command) {
        let commandClass = ClassNameInflector.classOf(command);

        if (!this.handlers[commandClass]) {
            throw new NoCommandHandlerException(commandClass);
        }

        this.handlers[commandClass].handle(command);
    }
}
