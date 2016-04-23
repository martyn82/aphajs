
export class NoCommandHandlerException extends Error {
    constructor(commandClass: string) {
        super(`No handler for command '${commandClass}'.`);
    }
}
