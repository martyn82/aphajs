
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class NoCommandHandlerException extends Exception {
    constructor(commandClass: string) {
        super(`No handler for command '${commandClass}'.`);
    }
}
