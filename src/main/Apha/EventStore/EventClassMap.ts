
import {EventType} from "../Message/Event";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {UnknownEventException} from "./UnknownEventException";

export class EventClassMap {
    private classMap: Map<string, EventType>;

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
        this.classMap.set(ClassNameInflector.className(eventType), eventType);
    }

    public unregister(eventType: EventType): void {
        const eventClassName = ClassNameInflector.className(eventType);

        if (this.classMap.has(eventClassName)) {
            this.classMap.delete(eventClassName);
        }
    }
}
