
import {EventBus} from "./EventBus";
import {EventListener} from "./EventListener";
import {Event} from "../Message/Event";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";

export class SimpleEventBus extends EventBus {
    private static wildcard = "*";
    private listeners: {[eventClass: string]: EventListener[]} = {};

    public subscribe(listener: EventListener, eventType?: {new(): Event}): void {
        let eventClass;

        if (eventType == null) {
            eventClass = SimpleEventBus.wildcard;
        } else {
            eventClass = ClassNameInflector.className(eventType);
        }

        if (!this.listeners[eventClass]) {
            this.listeners[eventClass] = [];
        }

        this.listeners[eventClass].push(listener);
    }

    public unsubscribe(listener: EventListener, eventType: {new(): Event}): void {
        let eventClass = ClassNameInflector.className(eventType);

        if (!this.listeners[eventClass]) {
            return;
        }

        let index = this.listeners[eventClass].indexOf(listener);

        if (index > -1) {
            delete this.listeners[eventClass][index];
        }
    }

    public publish(event: Event): boolean {
        let eventClass = ClassNameInflector.classOf(event);
        let listeners = this.findListeners([SimpleEventBus.wildcard, eventClass]);

        if (listeners.length === 0) {
            return false;
        }

        listeners.forEach((handler) => {
            handler.on(event);
        });

        return true;
    }

    private findListeners(eventClasses: string[]): EventListener[] {
        let listeners = [];

        eventClasses.forEach((eventClass) => {
            if (!this.listeners[eventClass]) {
                return;
            }

            this.listeners[eventClass].forEach((listener) => {
                if (listeners.indexOf(listener) === -1) {
                    listeners.push(listener);
                }
            });
        });

        return listeners;
    }
}
