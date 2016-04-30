
import {CommandHandler} from "./CommandHandler";
import {Command, CommandType} from "../Message/Command";

export abstract class CommandBus {
    public abstract registerHandler(commandType: CommandType, handler: CommandHandler): void;
    public abstract unregisterHandler(commandType: CommandType): void;
    public abstract send(command: Command): void;
}
