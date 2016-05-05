
import {Exception} from "../../Exception";

export class ConcurrencyException extends Exception {
    constructor(expectedPlayhead: number, actualPlayhead: number) {
        super(`Playhead was expected to be '${expectedPlayhead}' but was '${actualPlayhead}'.`);
    }
}
