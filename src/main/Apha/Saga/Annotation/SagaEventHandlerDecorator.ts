
import "reflect-metadata";
import {MetadataKeys} from "../../Decorators/MetadataKeys";
import {AnnotatedSaga} from "./AnnotatedSaga";
import {ClassNameInflector} from "../../Inflection/ClassNameInflector";
import {DecoratorException} from "../../Decorators/DecoratorException";
import {Event} from "../../Message/Event";
import {UnsupportedEventException} from "../../EventHandling/UnsupportedEventException";
import {AnnotatedSagaStarters, StartSagaDecorator} from "./StartSagaDecorator";
import {AnnotatedSagaEndings, EndSagaDecorator} from "./EndSagaDecorator";
import {AssociationValue} from "../AssociationValue";
import {Message} from "../../Message/Message";

export type AnnotatedSagaEventHandlers = {[eventClass: string]: [Function, string]};
export type SagaEventHandlerOptions = {
    associationProperty?: string
};

export namespace SagaEventHandlerDecorator {
    export const SAGA_EVENT_HANDLERS = "annotations:sagaeventhandlers";
}

export function SagaEventHandler(options?: SagaEventHandlerOptions): Function {
    return (
        target: AnnotatedSaga,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        const paramTypes = Reflect.getMetadata(MetadataKeys.PARAM_TYPES, target, methodName);

        if (paramTypes.length === 0) {
            const targetClass = ClassNameInflector.classOf(target);
            throw new DecoratorException(targetClass, methodName, "SagaEventHandler");
        }

        const handlers: AnnotatedSagaEventHandlers =
            Reflect.getOwnMetadata(SagaEventHandlerDecorator.SAGA_EVENT_HANDLERS, target) || {};
        const eventClass = Message.fqn(paramTypes[0]);

        handlers[eventClass] = [descriptor.value, options ? options.associationProperty : undefined];
        Reflect.defineMetadata(SagaEventHandlerDecorator.SAGA_EVENT_HANDLERS, handlers, target);
    };
}

export function SagaEventHandlerDispatcher(): Function {
    return (
        target: AnnotatedSaga,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        descriptor.value = function (event: Event) {
            const handlers: AnnotatedSagaEventHandlers =
                Reflect.getMetadata(SagaEventHandlerDecorator.SAGA_EVENT_HANDLERS, this) || {};
            const eventClass = event.fullyQualifiedName;

            if (!handlers[eventClass]) {
                throw new UnsupportedEventException(eventClass);
            }

            const handler = handlers[eventClass];

            const starters: AnnotatedSagaStarters = Reflect.getMetadata(StartSagaDecorator.SAGA_STARTERS, this) || {};
            const endings: AnnotatedSagaEndings = Reflect.getMetadata(EndSagaDecorator.SAGA_ENDINGS, this) || {};

            const associatedValue = this.parameterResolver.resolveParameterValue(event, handler[1]);
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
}
