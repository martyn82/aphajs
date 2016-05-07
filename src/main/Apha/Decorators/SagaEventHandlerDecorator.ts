
import "reflect-metadata";
import {MetadataKeys} from "./MetadataKeys";
import {AnnotatedSaga} from "../Saga/Annotation/AnnotatedSaga";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {DecoratorException} from "./DecoratorException";
import {Event} from "../Message/Event";
import {UnsupportedEventException} from "../EventHandling/UnsupportedEventException";
import {AnnotatedSagaStarters} from "./StartSagaDecorator";
import {AnnotatedSagaEndings} from "./EndSagaDecorator";

export type AnnotatedSagaEventHandlers = {[eventClass: string]: [Function, string]};
export type SagaEventHandlerOptions = {
    associationProperty?: string
};

export function SagaEventHandler(options?: SagaEventHandlerOptions) {
    return (
        target: AnnotatedSaga,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        let paramTypes = Reflect.getMetadata(MetadataKeys.PARAM_TYPES, target, methodName);

        if (paramTypes.length === 0) {
            let targetClass = ClassNameInflector.classOf(target);
            throw new DecoratorException(targetClass, methodName, "SagaEventHandler");
        }

        let handlers: AnnotatedSagaEventHandlers =
            Reflect.getOwnMetadata(MetadataKeys.SAGA_EVENT_HANDLERS, target) || {};
        let eventClass = ClassNameInflector.className(paramTypes[0]);

        handlers[eventClass] = [descriptor.value, options ? options.associationProperty : undefined];
        Reflect.defineMetadata(MetadataKeys.SAGA_EVENT_HANDLERS, handlers, target);
    };
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

        let starters: AnnotatedSagaStarters = Reflect.getMetadata(MetadataKeys.SAGA_STARTERS, this) || {};
        let endings: AnnotatedSagaEndings = Reflect.getMetadata(MetadataKeys.SAGA_ENDINGS, this) || {};

        let associatedValue = this.parameterResolver.resolveParameterValue(event, handler[1]);
        this.associateWith(associatedValue);

        if (starters.has(handler[0].name)) {
            this.start();
        }

        handler[0].call(this, event);

        if (endings.has(handler[0].name)) {
            this.end();
        }
    };
}
