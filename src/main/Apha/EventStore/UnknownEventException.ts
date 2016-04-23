
export class UnknownEventException extends Error {
    constructor(eventClass: string) {
        super(`Unknown event type '${eventClass}'.`);
    }
}
