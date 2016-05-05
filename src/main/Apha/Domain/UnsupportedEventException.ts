
import {Exception} from "../../Exception";

export class UnsupportedEventException extends Exception {
    constructor(eventClass: string, aggregate: string) {
        super(`Event '${eventClass}' is not supported for aggregate '${aggregate}'.`);
    }
}
