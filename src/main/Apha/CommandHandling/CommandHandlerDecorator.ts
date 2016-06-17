
import "reflect-metadata";
import {MetadataKeys} from "../Decorators/MetadataKeys";
import {AnnotatedCommandHandler} from "./AnnotatedCommandHandler";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {DecoratorException} from "../Decorators/DecoratorException";
import {Command, CommandType} from "../Message/Command";
import {UnsupportedCommandException} from "./UnsupportedCommandException";

export type AnnotatedCommandHandlers = {[commandClass: string]: Function};

type CommandDescriptor = {
    type: Function,
    commandName: string
};

type DeferredCommandHandler = {
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>,
    command: CommandDescriptor
};

namespace CommandHandlerDecorator {
    export const COMMAND_HANDLERS = "annotations:commandhandlers";
    export const COMMAND_TYPES = "annotations:commandtypes";
    export const DEFERRED = "annotations:deferredcommandhandlers";
}

export function CommandHandler(commandDescriptor?: {type: Function, commandName: string}): Function {
    return (
        target: AnnotatedCommandHandler,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        if (commandDescriptor) {
            const deferred: DeferredCommandHandler[] =
                Reflect.getMetadata(CommandHandlerDecorator.DEFERRED, target) || [];
            deferred.push({
                methodName: methodName,
                descriptor: descriptor,
                command: commandDescriptor
            });
            Reflect.defineMetadata(CommandHandlerDecorator.DEFERRED, deferred, target);
            return;
        }

        const paramTypes = Reflect.getMetadata(MetadataKeys.PARAM_TYPES, target, methodName) || [];

        if (paramTypes.length === 0 || typeof paramTypes[0] === "undefined") {
            const targetClass = ClassNameInflector.classOf(target);
            throw new DecoratorException(targetClass, methodName, "CommandHandler");
        }

        const commandType: CommandType = paramTypes[0];
        const commandClass = ClassNameInflector.className(commandType);

        const handlers: AnnotatedCommandHandlers =
            Reflect.getOwnMetadata(CommandHandlerDecorator.COMMAND_HANDLERS, target) || {};

        handlers[commandClass] = descriptor.value;
        Reflect.defineMetadata(CommandHandlerDecorator.COMMAND_HANDLERS, handlers, target);

        const types = Reflect.getOwnMetadata(CommandHandlerDecorator.COMMAND_TYPES, target) || new Set<CommandType>();
        types.add(commandType);
        Reflect.defineMetadata(CommandHandlerDecorator.COMMAND_TYPES, types, target);
    };
}

export function CommandHandlerDispatcher(): Function {
    return (
        target: AnnotatedCommandHandler,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        descriptor.value = function (command: Command) {
            const handlers: AnnotatedCommandHandlers =
                Reflect.getMetadata(CommandHandlerDecorator.COMMAND_HANDLERS, this) || {};
            const commandClass = ClassNameInflector.classOf(command);

            if (!handlers[commandClass]) {
                throw new UnsupportedCommandException(commandClass);
            }

            handlers[commandClass].call(this, command);
        };
    };
}

export function SupportedCommandTypesRetriever(): Function {
    return (
        target: AnnotatedCommandHandler,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        descriptor.value = function (): Set<CommandType> {
            return Reflect.getMetadata(CommandHandlerDecorator.COMMAND_TYPES, this) || new Set<CommandType>();
        };
    };
}

export function defineDeferredCommandHandlers(target: AnnotatedCommandHandler): void {
    const deferred: DeferredCommandHandler[] = Reflect.getMetadata(CommandHandlerDecorator.DEFERRED, target) || [];
    deferred.forEach(handler => {
        const commandType = handler.command.type[handler.command.commandName];
        Reflect.defineMetadata(MetadataKeys.PARAM_TYPES, [commandType], target, handler.methodName);
        CommandHandler()(target, handler.methodName, handler.descriptor);
    });
    Reflect.defineMetadata(CommandHandlerDecorator.DEFERRED, [], target);
}
