
import {Event} from "../Message/Event";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {UnsupportedEventException} from "./UnsupportedEventException";

export type AggregateRootType<T extends AggregateRoot | AggregateRoot> = {new(...args: any[]): T};

export abstract class AggregateRoot {
    private version: number = -1;
    private eventLog: Event[] = [];

    constructor() {}

    public loadFromHistory(history: Event[]): void {
        history.forEach((event) => {
            this.apply(event, false);
        });
    }

    public abstract getId(): string;

    public getVersion(): number {
        return this.version;
    }

    protected on(event: Event): void {
        this.handleByInflection(event);
    }

    private handleByInflection(event: Event): void {
        let eventClass = ClassNameInflector.classOf(event);
        let handler = this["on" + eventClass];

        if (typeof handler !== "function") {
            throw new UnsupportedEventException(eventClass, ClassNameInflector.classOf(this));
        }

        handler.call(this, event);
    }

    protected apply(event: Event, change: boolean = true): void {
        if (change) {
            this.eventLog.push(event);
        } else {
            this.version = event.getVersion();
        }

        this.on(event);
    }

    public getUncommittedChanges(): Event[] {
        return this.eventLog;
    }

    public markChangesCommitted(): void {
        this.eventLog.splice(0, this.eventLog.length);
    }
}
