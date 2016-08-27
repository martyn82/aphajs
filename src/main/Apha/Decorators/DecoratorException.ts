
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class DecoratorException extends Exception {
    constructor(targetClass: string, name: string, decoratorName: string) {
        super(`Invalid ${decoratorName} decorator for '${targetClass}.${name}'.`);
    }
}
