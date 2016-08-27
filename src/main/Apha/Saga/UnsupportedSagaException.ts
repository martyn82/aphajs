
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class UnsupportedSagaException extends Exception {
    constructor(sagaClass: string) {
        super(`Unsupported saga type '${sagaClass}.`);
    }
}
