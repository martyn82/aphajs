
import {Event} from "../Message/Event";
import {EventListener} from "./EventListener";

export abstract class EventBus {
    public abstract subscribe(listener: EventListener, eventType?: {new(): Event}): void;
    public abstract unsubscribe(listener: EventListener, eventType: {new(): Event}): void;
    public abstract publish(event: Event): boolean;
}
