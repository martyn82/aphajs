
import {EventListener} from "./EventListener";
import {Event} from "../Message/Event";
import {EventListenerDispatcher} from "../Decorators/EventListenerDecorator";

export abstract class AnnotatedEventListener implements EventListener {
    @EventListenerDispatcher
    public on(event: Event): void {
    }
}
