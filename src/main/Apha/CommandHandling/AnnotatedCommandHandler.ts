
import {CommandHandler} from "./CommandHandler";
import {Command, CommandType} from "../Message/Command";
import {CommandHandlerDispatcher, SupportedCommandTypesRetriever} from "./CommandHandlerDecorator";

export abstract class AnnotatedCommandHandler implements CommandHandler {
    @CommandHandlerDispatcher()
    public async handle(command: Command): Promise<void> {
    }

    @SupportedCommandTypesRetriever()
    public getSupportedCommands(): Set<CommandType> {
        return new Set<CommandType>();
    }
}
