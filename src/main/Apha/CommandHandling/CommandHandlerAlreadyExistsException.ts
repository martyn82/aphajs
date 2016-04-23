
export class CommandHandlerAlreadyExistsException extends Error {
    constructor(commandClass: string) {
        super(`Only one command handler can be registered for command '${commandClass}'.`);
    }
}
