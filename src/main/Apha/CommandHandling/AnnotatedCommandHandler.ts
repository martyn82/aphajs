
import {CommandHandler} from "./CommandHandler";
import {Command} from "../Message/Command";
import {CommandHandlerDispatcher} from "../Decorators/CommandHandlerDecorator";

export abstract class AnnotatedCommandHandler implements CommandHandler {
    @CommandHandlerDispatcher
    public handle(command: Command): void {
    }
}
