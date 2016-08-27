
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class UnknownEventException extends Exception {
    constructor(eventClass: string) {
        super(`Unknown event type '${eventClass}'.`);
    }
}
