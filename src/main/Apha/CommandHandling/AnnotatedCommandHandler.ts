
import {CommandHandler} from "./CommandHandler";
import {Command, CommandType} from "../Message/Command";
import {CommandHandlerDispatcher, SupportedCommandTypesRetriever} from "./CommandHandlerDecorator";

export abstract class AnnotatedCommandHandler implements CommandHandler {
    @CommandHandlerDispatcher()
    public handle(command: Command): void {
    }

    @SupportedCommandTypesRetriever()
    public getSupportedCommands(): Set<CommandType> {
        return new Set<CommandType>();
    }
}
