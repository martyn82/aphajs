
import {Event, EventType} from "../Message/Event";
import {EventListener} from "./EventListener";

export abstract class EventBus {
    public abstract subscribe(listener: EventListener, eventType?: EventType): void;
    public abstract unsubscribe(listener: EventListener, eventType: EventType): void;
    public abstract publish(event: Event): boolean;
}
