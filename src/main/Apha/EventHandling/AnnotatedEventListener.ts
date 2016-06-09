
import {EventListener} from "./EventListener";
import {Event, EventType} from "../Message/Event";
import {EventListenerDispatcher} from "./EventListenerDecorator";

export abstract class AnnotatedEventListener implements EventListener {
    @EventListenerDispatcher()
    public on(event: Event): void {
    }

    public getSupportedEvents(): EventType[] {
        return [];
    }
}
