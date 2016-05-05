
import {Exception} from "../../Exception";

export class UnsupportedCommandException extends Exception {
    constructor(commandClass: string) {
        super(`Unsupported command '${commandClass}'.`);
    }
}
