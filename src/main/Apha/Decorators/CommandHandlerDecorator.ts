
import "reflect-metadata";
import {MetadataKeys} from "./MetadataKeys";
import {AnnotatedCommandHandler} from "../CommandHandling/AnnotatedCommandHandler";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {DecoratorException} from "./DecoratorException";
import {Command} from "../Message/Command";
import {UnsupportedCommandException} from "../CommandHandling/UnsupportedCommandException";

export type AnnotatedCommandHandlers = {[commandClass: string]: Function};

export function CommandHandler(
    target: AnnotatedCommandHandler,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    let paramTypes = Reflect.getMetadata(MetadataKeys.PARAM_TYPES, target, methodName);

    if (paramTypes.length === 0) {
        let targetClass = ClassNameInflector.classOf(target);
        throw new DecoratorException(targetClass, methodName, "CommandHandler");
    }

    let handlers: AnnotatedCommandHandlers = Reflect.getOwnMetadata(MetadataKeys.COMMAND_HANDLERS, target) || {};
    let commandClass = ClassNameInflector.className(paramTypes[0]);

    handlers[commandClass] = descriptor.value;
    Reflect.defineMetadata(MetadataKeys.COMMAND_HANDLERS, handlers, target);
}

export function CommandHandlerDispatcher(
    target: AnnotatedCommandHandler,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    descriptor.value = function (command: Command) {
        let handlers: AnnotatedCommandHandlers = Reflect.getMetadata(MetadataKeys.COMMAND_HANDLERS, this) || {};
        let commandClass = ClassNameInflector.classOf(command);

        if (!handlers[commandClass]) {
            throw new UnsupportedCommandException(commandClass);
        }

        handlers[commandClass].call(this, command);
    };
}
