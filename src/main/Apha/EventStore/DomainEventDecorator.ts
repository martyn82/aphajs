
import {EventType} from "../Message/Event";
import {AnnotatedEventClassMap} from "./AnnotatedEventClassMap";

const EventRegistry = new Set<EventType>();

namespace DomainEventDecorator {
    export const EVENTS = "annotations:events";
}

export function DomainEvent(): Function {
    return (target: Function): void => {
        EventRegistry.add(<EventType>target);
    };
}

export function DomainEventsReceiver(): Function {
    return (
        target: AnnotatedEventClassMap,
        methodName: string,
        descriptor: TypedPropertyDescriptor<Function>
    ): void => {
        Reflect.defineMetadata(DomainEventDecorator.EVENTS, EventRegistry, target);

        descriptor.value = function (): void {
            const eventTypes = Reflect.getMetadata(DomainEventDecorator.EVENTS, this);
            for (const eventType of eventTypes.values()) {
                this.register(eventType);
            }
        };
    };
}
