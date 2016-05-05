
import {Exception} from "../../Exception";

export class CommandHandlerAlreadyExistsException extends Exception {
    constructor(commandClass: string) {
        super(`Only one command handler can be registered for command '${commandClass}'.`);
    }
}
