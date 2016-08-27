
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class CommandHandlerAlreadyExistsException extends Exception {
    constructor(commandClass: string) {
        super(`Only one command handler can be registered for command '${commandClass}'.`);
    }
}
