
export class UnsupportedEventException extends Error {
    constructor(eventClass: string, aggregate: string) {
        super(`Event '${eventClass}' is not supported for aggregate '${aggregate}'.`);
    }
}
