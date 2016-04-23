
import {Event} from "../Message/Event";
import {EventListener} from "./EventListener";

export abstract class EventBus {
    public abstract subscribe(listener: EventListener, eventType?: {new(...args: any[]): Event}): void;
    public abstract unsubscribe(listener: EventListener, eventType: {new(...args: any[]): Event}): void;
    public abstract publish(event: Event): boolean;
}
