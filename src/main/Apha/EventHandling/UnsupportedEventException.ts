
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class UnsupportedEventException extends Exception {
    constructor(eventClass: string) {
        super(`Unsupported event '${eventClass}'.`);
    }
}
