
import "reflect-metadata";
import {MetadataKeys} from "../Decorators/MetadataKeys";
import {AnnotatedEventListener} from "./AnnotatedEventListener";
import {DecoratorException} from "../Decorators/DecoratorException";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {Event, EventType} from "../Message/Event";
import {UnsupportedEventException} from "./UnsupportedEventException";
import {Message} from "../Message/Message";

export type AnnotatedEventListeners = Map<string, Function>;

type EventDescriptor = {
    type: Function,
    eventName: string
};

type DeferredEventListener = {
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>,
    event: EventDescriptor
};

namespace EventListenerDecorator {
    export const EVENT_HANDLERS = "annotations:eventhandlers";
    export const EVENT_TYPES = "annotations:eventtypes";
    export const DEFERRED = "annotations:deferredeventhandlers";
}

export function EventListener(eventDescriptor?: {type: Function, eventName: string}): Function {
    return (
        target: AnnotatedEventListener,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        if (eventDescriptor) {
            const deferred: DeferredEventListener[] =
                Reflect.getMetadata(EventListenerDecorator.DEFERRED, target) || [];
            deferred.push({
                methodName: methodName,
                descriptor: descriptor,
                event: eventDescriptor
            });
            Reflect.defineMetadata(EventListenerDecorator.DEFERRED, deferred, target);
            return;
        }

        const paramTypes = Reflect.getMetadata(MetadataKeys.PARAM_TYPES, target, methodName) || [];

        if (paramTypes.length === 0 || typeof paramTypes[0] === "undefined") {
            const targetClass = ClassNameInflector.classOf(target);
            throw new DecoratorException(targetClass, methodName, "EventListener");
        }

        const eventType: EventType = paramTypes[0];
        const eventClass = Message.fqn(eventType);

        const handlers: AnnotatedEventListeners =
            Reflect.getOwnMetadata(EventListenerDecorator.EVENT_HANDLERS, target) || new Map<string, Function>();

        handlers.set(eventClass, descriptor.value);
        Reflect.defineMetadata(EventListenerDecorator.EVENT_HANDLERS, handlers, target);

        const types = Reflect.getOwnMetadata(EventListenerDecorator.EVENT_TYPES, target) || new Set<EventType>();
        types.add(eventType);
        Reflect.defineMetadata(EventListenerDecorator.EVENT_TYPES, types, target);
    };
}

export function EventListenerDispatcher(): Function {
    return (
        target: AnnotatedEventListener,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        descriptor.value = function (event: Event) {
            const handlers: AnnotatedEventListeners =
                Reflect.getMetadata(EventListenerDecorator.EVENT_HANDLERS, this) || new Map<string, Function>();
            const eventClass = event.fullyQualifiedName;

            if (!handlers.has(eventClass)) {
                throw new UnsupportedEventException(eventClass);
            }

            handlers.get(eventClass).call(this, event);
        };
    }
}

export function SupportedEventTypesRetriever(): Function {
    return (
        target: AnnotatedEventListener,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        descriptor.value = function (): Set<EventType> {
            return Reflect.getMetadata(EventListenerDecorator.EVENT_TYPES, this) || new Set<EventType>();
        };
    };
}

export function defineDeferredEventListeners(target: AnnotatedEventListener): void {
    const deferred: DeferredEventListener[] = Reflect.getMetadata(EventListenerDecorator.DEFERRED, target) || [];
    deferred.forEach(handler => {
        const eventType = handler.event.type[handler.event.eventName];
        Reflect.defineMetadata(MetadataKeys.PARAM_TYPES, [eventType], target, handler.methodName);
        EventListener()(target, handler.methodName, handler.descriptor);
    });
    Reflect.defineMetadata(EventListenerDecorator.DEFERRED, [], target);
}
