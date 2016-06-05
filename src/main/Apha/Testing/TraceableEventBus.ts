
import {EventBus} from "../EventHandling/EventBus";
import {TraceableEventHandler} from "./TraceableEventHandler";
import {Event, EventType} from "../Message/Event";
import {EventListener} from "../EventHandling/EventListener";

export class TraceableEventBus extends EventBus implements TraceableEventHandler {
    private eventLog: Event[] = [];

    constructor(private eventBus: EventBus) {
        super();
    }

    public subscribe(listener: EventListener, eventType?: EventType): void {
        this.eventBus.subscribe(listener, eventType);
    }

    public unsubscribe(listener: EventListener, eventType: EventType): void {
        this.eventBus.unsubscribe(listener, eventType);
    }

    public publish(event: Event): boolean {
        this.eventLog.push(event);
        return true;
    }

    public getEvents(): Event[] {
        return this.eventLog;
    }

    public clearTraceLog(): void {
        this.eventLog = [];
    }
}
