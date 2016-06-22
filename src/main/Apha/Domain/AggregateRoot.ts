
import {Event} from "../Message/Event";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {UnsupportedEventException} from "./UnsupportedEventException";

export type AggregateRootType<T extends AggregateRoot | AggregateRoot> = {new(...args: any[]): T};

export abstract class AggregateRoot {
    private _version: number = -1;
    private eventLog: Event[] = [];

    public loadFromHistory(history: Event[]): void {
        history.forEach((event) => {
            this.apply(event, false);
        });
    }

    public abstract getId(): string;

    public get version(): number {
        return this._version;
    }

    protected on(event: Event): void {
        this.applyByInflection(event);
    }

    private applyByInflection(event: Event): void {
        const eventClass = ClassNameInflector.classOf(event);
        const handler = this["on" + eventClass];

        if (typeof handler !== "function") {
            throw new UnsupportedEventException(eventClass, ClassNameInflector.classOf(this));
        }

        handler.call(this, event);
    }

    protected apply(event: Event, change: boolean = true): void {
        if (change) {
            this.eventLog.push(event);
        } else {
            this._version = event.version;
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
