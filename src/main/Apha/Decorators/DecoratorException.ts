
export class DecoratorException extends Error {
    constructor(targetClass: string, methodName: string, decoratorName: string) {
        super(`Invalid '${decoratorName}' decorator for '${targetClass}::${methodName}'.`);
    }
}
