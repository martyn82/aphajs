
export class UnsupportedCommandException extends Error {
    constructor(commandClass: string) {
        super(`Unsupported command '${commandClass}'.`);
    }
}
