
import {Exception} from "../../Exception";

export class UnsupportedSagaException extends Exception {
    constructor(sagaClass: string) {
        super(`Unsupported saga type '${sagaClass}.`);
    }
}
