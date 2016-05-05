
import {Exception} from "../../Exception";

export class UnknownEventException extends Exception {
    constructor(eventClass: string) {
        super(`Unknown event type '${eventClass}'.`);
    }
}
