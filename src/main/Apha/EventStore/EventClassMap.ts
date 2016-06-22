
import {EventType} from "../Message/Event";
import {UnknownEventException} from "./UnknownEventException";
import {Message} from "../Message/Message";

export class EventClassMap {
    protected classMap: Map<string, EventType>;

    constructor(eventTypes?: Set<EventType>) {
        eventTypes = eventTypes ? eventTypes : new Set<EventType>();
        this.classMap = new Map<string, EventType>();

        for (const eventType of eventTypes.values()) {
            this.register(eventType);
        }
    }

    public getTypeByClassName(eventClass: string): EventType {
        if (!this.classMap.has(eventClass)) {
            throw new UnknownEventException(eventClass);
        }

        return this.classMap.get(eventClass);
    }

    public register(eventType: EventType): void {
        this.classMap.set(Message.fqn(eventType), eventType);
    }

    public unregister(eventType: EventType): void {
        const eventClassName = Message.fqn(eventType);

        if (this.classMap.has(eventClassName)) {
            this.classMap.delete(eventClassName);
        }
    }
}
