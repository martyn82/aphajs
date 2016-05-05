
import "reflect-metadata";
import {MetadataKeys} from "./MetadataKeys";
import {AnnotatedEventListener} from "../EventHandling/AnnotatedEventListener";
import {DecoratorException} from "./DecoratorException";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {Event} from "../Message/Event";
import {UnsupportedEventException} from "../EventHandling/UnsupportedEventException";

export type AnnotatedEventListeners = {[eventClass: string]: Function};

export function EventListener(
    target: AnnotatedEventListener,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    let paramTypes = Reflect.getMetadata(MetadataKeys.PARAM_TYPES, target, methodName);

    if (paramTypes.length === 0) {
        let targetClass = ClassNameInflector.classOf(target);
        throw new DecoratorException(targetClass, methodName, "EventListener");
    }

    let handlers: AnnotatedEventListeners = Reflect.getMetadata(MetadataKeys.EVENT_HANDLERS, target) || {};
    let eventClass = ClassNameInflector.className(paramTypes[0]);

    handlers[eventClass] = descriptor.value;
    Reflect.defineMetadata(MetadataKeys.EVENT_HANDLERS, handlers, target);
}

export function EventListenerDispatcher(
    target: AnnotatedEventListener,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    descriptor.value = function (event: Event) {
        let handlers: AnnotatedEventListeners = Reflect.getMetadata(MetadataKeys.EVENT_HANDLERS, this) || {};
        let eventClass = ClassNameInflector.classOf(event);

        if (!handlers[eventClass]) {
            throw new UnsupportedEventException(eventClass);
        }

        handlers[eventClass].call(this, event);
    };
}
