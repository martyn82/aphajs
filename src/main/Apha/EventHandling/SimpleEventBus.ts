
import {EventBus} from "./EventBus";
import {EventListener} from "./EventListener";
import {Event, EventType} from "../Message/Event";
import {Message} from "../Message/Message";

export class SimpleEventBus extends EventBus {
    private static wildcard = "*";
    private listeners: Map<string, Set<EventListener>> = new Map<string, Set<EventListener>>();

    public subscribe(listener: EventListener, eventType?: EventType): void {
        let eventClass;

        if (eventType == null) {
            eventClass = SimpleEventBus.wildcard;
        } else {
            eventClass = Message.fqn(eventType);
        }

        if (!this.listeners.has(eventClass)) {
            this.listeners.set(eventClass, new Set<EventListener>());
        }

        this.listeners.get(eventClass).add(listener);
    }

    public unsubscribe(listener: EventListener, eventType: EventType): void {
        const eventClass = Message.fqn(eventType);

        if (!this.listeners.has(eventClass)) {
            return;
        }

        this.listeners.get(eventClass).delete(listener);
    }

    public publish(event: Event): boolean {
        const eventClass = event.fullyQualifiedName;
        const listeners = this.findListeners([SimpleEventBus.wildcard, eventClass]);

        if (listeners.size === 0) {
            return false;
        }

        for (const listener of listeners.values()) {
            listener.on(event);
        }

        return true;
    }

    private findListeners(eventClasses: string[]): Set<EventListener> {
        const listeners = new Set<EventListener>();

        eventClasses.forEach(eventClass => {
            if (!this.listeners.has(eventClass)) {
                return;
            }

            for (const listener of this.listeners.get(eventClass).values()) {
                listeners.add(listener);
            }
        });

        return listeners;
    }
}
