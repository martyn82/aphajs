
import {Exception} from "../../Exception";

export class NoCommandHandlerException extends Exception {
    constructor(commandClass: string) {
        super(`No handler for command '${commandClass}'.`);
    }
}
