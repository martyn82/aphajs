
import "reflect-metadata";
import {MetadataKeys} from "./MetadataKeys";
import {AnnotatedSaga} from "../Saga/Annotation/AnnotatedSaga";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {DecoratorException} from "./DecoratorException";
import {Event} from "../Message/Event";
import {UnsupportedEventException} from "../EventHandling/UnsupportedEventException";

type AnnotatedSagaEventHandlers = {[eventClass: string]: Function};

export function SagaEventHandler(
    target: AnnotatedSaga,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    let paramTypes = Reflect.getMetadata(MetadataKeys.PARAM_TYPES, target, methodName) || [];

    if (paramTypes.length === 0) {
        let targetClass = ClassNameInflector.classOf(target);
        throw new DecoratorException(targetClass, methodName, "SagaEventHandler");
    }

    let handlers: AnnotatedSagaEventHandlers = Reflect.getOwnMetadata(MetadataKeys.SAGA_EVENT_HANDLERS, target) || {};
    let eventClass = ClassNameInflector.className(paramTypes[0]);

    handlers[eventClass] = descriptor.value;
    Reflect.defineMetadata(MetadataKeys.SAGA_EVENT_HANDLERS, handlers, target);
}

export function SagaEventHandlerDispatcher(
    target: AnnotatedSaga,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    descriptor.value = function (event: Event) {
        let handlers: AnnotatedSagaEventHandlers = Reflect.getMetadata(MetadataKeys.SAGA_EVENT_HANDLERS, this) || {};
        let eventClass = ClassNameInflector.classOf(event);

        if (!handlers[eventClass]) {
            throw new UnsupportedEventException(eventClass);
        }

        let handler = handlers[eventClass];

        // resolve parameter values to associate
        // associate with values
        // check if saga should be started first

        handler.call(this, event);

        // check if saga should be ended
    };
}
