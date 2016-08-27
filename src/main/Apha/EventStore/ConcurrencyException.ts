
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class ConcurrencyException extends Exception {
    constructor(expectedPlayhead: number, actualPlayhead: number) {
        super(`Playhead was expected to be '${expectedPlayhead}' but was '${actualPlayhead}'.`);
    }
}
