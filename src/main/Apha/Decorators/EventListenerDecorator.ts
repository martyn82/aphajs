
import "reflect-metadata";
import {AnnotatedEventListener} from "../EventHandling/AnnotatedEventListener";
import {DecoratorException} from "./DecoratorException";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {Event} from "../Message/Event";
import {UnsupportedEventException} from "../EventHandling/UnsupportedEventException";

const EVENTLISTENERS_METADATA_KEY = "annotations:eventlisteners";
const PARAMTYPES_METADATA_KEY = "design:paramtypes";

type AnnotatedEventListeners = {[eventClass: string]: Function};

export function EventListener(
    target: AnnotatedEventListener,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
) {
    let paramTypes = Reflect.getMetadata(PARAMTYPES_METADATA_KEY, target, methodName);

    if (paramTypes.length === 0) {
        let targetClass = ClassNameInflector.classOf(target);
        throw new DecoratorException(targetClass, methodName, "EventListener");
    }

    let handlers: AnnotatedEventListeners = Reflect.getMetadata(EVENTLISTENERS_METADATA_KEY, target) || {};
    let eventClass = ClassNameInflector.className(paramTypes[0]);

    handlers[eventClass] = descriptor.value;
    Reflect.defineMetadata(EVENTLISTENERS_METADATA_KEY, handlers, target);
}

export function EventListenerDispatcher(
    target: AnnotatedEventListener,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
) {
    descriptor.value = function (event: Event) {
        let handlers: AnnotatedEventListeners = Reflect.getMetadata(EVENTLISTENERS_METADATA_KEY, this) || {};
        let eventClass = ClassNameInflector.classOf(event);

        if (!handlers[eventClass]) {
            throw new UnsupportedEventException(eventClass);
        }

        handlers[eventClass].call(this, event);
    };
}
