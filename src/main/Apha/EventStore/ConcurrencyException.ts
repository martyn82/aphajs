
export class ConcurrencyException extends Error {
    constructor(expectedPlayhead: number, actualPlayhead: number) {
        super(`Playhead was expected to be '${expectedPlayhead}' but was '${actualPlayhead}'.`);
    }
}
