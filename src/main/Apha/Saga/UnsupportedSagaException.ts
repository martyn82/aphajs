
export class UnsupportedSagaException extends Error {
    constructor(sagaClass: string) {
        super(`Unsupported saga type '${sagaClass}.`);
    }
}
