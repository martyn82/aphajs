
import "reflect-metadata";
import {AnnotatedCommandHandler} from "../CommandHandling/AnnotatedCommandHandler";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {DecoratorException} from "./DecoratorException";
import {Command} from "../Message/Command";
import {UnsupportedCommandException} from "../CommandHandling/UnsupportedCommandException";

const COMMANDHANDLERS_METADATA_KEY = "annotations:commandhandlers";
const PARAMTYPES_METADATA_KEY = "design:paramtypes";

type AnnotatedCommandHandlers = {[commandClass: string]: Function};

export function CommandHandler(
    target: AnnotatedCommandHandler,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
) {
    let paramTypes = Reflect.getMetadata(PARAMTYPES_METADATA_KEY, target, methodName);

    if (paramTypes.length === 0) {
        let targetClass = ClassNameInflector.classOf(target);
        throw new DecoratorException(targetClass, methodName, "CommandHandler");
    }

    let handlers: AnnotatedCommandHandlers = Reflect.getOwnMetadata(COMMANDHANDLERS_METADATA_KEY, target) || {};
    let commandClass = ClassNameInflector.className(paramTypes[0]);

    handlers[commandClass] = descriptor.value;
    Reflect.defineMetadata(COMMANDHANDLERS_METADATA_KEY, handlers, target);
}

export function CommandHandlerDispatcher(
    target: AnnotatedCommandHandler,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
) {
    descriptor.value = function (command: Command) {
        let handlers: AnnotatedCommandHandlers = Reflect.getMetadata(COMMANDHANDLERS_METADATA_KEY, this) || {};
        let commandClass = ClassNameInflector.classOf(command);

        if (!handlers[commandClass]) {
            throw new UnsupportedCommandException(commandClass);
        }

        handlers[commandClass].call(this, command);
    };
}
