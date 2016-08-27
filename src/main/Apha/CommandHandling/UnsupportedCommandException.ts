
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class UnsupportedCommandException extends Exception {
    constructor(commandClass: string) {
        super(`Unsupported command '${commandClass}'.`);
    }
}
