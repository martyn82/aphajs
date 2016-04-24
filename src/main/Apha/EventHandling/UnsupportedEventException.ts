
export class UnsupportedEventException extends Error {
    constructor(eventClass: string) {
        super(`Unsupported event '${eventClass}'.`);
    }
}
