
import {EventListener} from "./EventListener";
import {Event} from "../Message/Event";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {UnsupportedEventException} from "./UnsupportedEventException";

export class TypedEventListener implements EventListener {
    public on(event: Event): void {
        this.handleByInflection(event);
    }

    private handleByInflection(event: Event): void {
        const eventClass = ClassNameInflector.classOf(event);
        const handler = this["on" + eventClass];

        if (typeof handler !== "function") {
            throw new UnsupportedEventException(eventClass);
        }

        handler.call(this, event);
    }
}
