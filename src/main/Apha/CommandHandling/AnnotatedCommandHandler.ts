
import {CommandHandler} from "./CommandHandler";
import {Command, CommandType} from "../Message/Command";
import {CommandHandlerDispatcher} from "./CommandHandlerDecorator";

export abstract class AnnotatedCommandHandler implements CommandHandler {
    @CommandHandlerDispatcher()
    public handle(command: Command): void {
    }

    public getSupportedCommands(): CommandType[] {
        return [];
    }
}
