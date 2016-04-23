
import {CommandHandler} from "./CommandHandler";
import {Command} from "../Message/Command";

export abstract class CommandBus {
    public abstract registerHandler(commandType: {new(...args: any[]): Command}, handler: CommandHandler): void;
    public abstract unregisterHandler(commandType: {new(...args: any[]): Command}): void;
    public abstract send(command: Command): void;
}
