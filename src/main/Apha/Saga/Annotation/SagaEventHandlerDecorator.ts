
import "reflect-metadata";
import {MetadataKeys} from "../../Decorators/MetadataKeys";
import {AnnotatedSaga} from "./AnnotatedSaga";
import {ClassNameInflector} from "../../Inflection/ClassNameInflector";
import {DecoratorException} from "../../Decorators/DecoratorException";
import {Event} from "../../Message/Event";
import {UnsupportedEventException} from "../../EventHandling/UnsupportedEventException";
import {AnnotatedSagaStarters, SAGA_STARTERS} from "./StartSagaDecorator";
import {AnnotatedSagaEndings, SAGA_ENDINGS} from "./EndSagaDecorator";
import {AssociationValue} from "../AssociationValue";

export type AnnotatedSagaEventHandlers = {[eventClass: string]: [Function, string]};
export type SagaEventHandlerOptions = {
    associationProperty?: string
};

export const SAGA_EVENT_HANDLERS = "annotations:sagaeventhandlers";

export function SagaEventHandler(options?: SagaEventHandlerOptions): Function {
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

        let handlers: AnnotatedSagaEventHandlers = Reflect.getOwnMetadata(SAGA_EVENT_HANDLERS, target) || {};
        let eventClass = ClassNameInflector.className(paramTypes[0]);

        handlers[eventClass] = [descriptor.value, options ? options.associationProperty : undefined];
        Reflect.defineMetadata(SAGA_EVENT_HANDLERS, handlers, target);
    };
}

export function SagaEventHandlerDispatcher(
    target: AnnotatedSaga,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    descriptor.value = function (event: Event) {
        let handlers: AnnotatedSagaEventHandlers = Reflect.getMetadata(SAGA_EVENT_HANDLERS, this) || {};
        let eventClass = ClassNameInflector.classOf(event);

        if (!handlers[eventClass]) {
            throw new UnsupportedEventException(eventClass);
        }

        let handler = handlers[eventClass];

        let starters: AnnotatedSagaStarters = Reflect.getMetadata(SAGA_STARTERS, this) || {};
        let endings: AnnotatedSagaEndings = Reflect.getMetadata(SAGA_ENDINGS, this) || {};

        let associatedValue = this.parameterResolver.resolveParameterValue(event, handler[1]);
        this.associateWith(new AssociationValue(handler[1], associatedValue));

        if (starters.has(handler[0].name)) {
            this.start();
        }

        if (this.isActive()) {
            handler[0].call(this, event);
        }

        if (endings.has(handler[0].name)) {
            this.end();
        }
    };
}
