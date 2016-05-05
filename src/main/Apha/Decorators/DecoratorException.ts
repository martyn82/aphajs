
import {Exception} from "../../Exception";

export class DecoratorException extends Exception {
    constructor(targetClass: string, methodName: string, decoratorName: string) {
        super(`Invalid '${decoratorName}' decorator for '${targetClass}::${methodName}'.`);
    }
}
