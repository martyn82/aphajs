
import {Exception} from "../../Exception";

export class UnsupportedEventException extends Exception {
    constructor(eventClass: string) {
        super(`Unsupported event '${eventClass}'.`);
    }
}
