
import {EventListener} from "./EventListener";
import {Event, EventType} from "../Message/Event";
import {EventListenerDispatcher, SupportedEventTypesRetriever} from "./EventListenerDecorator";

export abstract class AnnotatedEventListener implements EventListener {
    @EventListenerDispatcher()
    public on(event: Event): void {
    }

    @SupportedEventTypesRetriever()
    public getSupportedEvents(): EventType[] {
        return [];
    }
}
