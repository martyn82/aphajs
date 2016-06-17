
import {Cluster} from "./Cluster";
import {EventListener} from "./EventListener";
import {Event} from "../Message/Event";
import {EventBus} from "./EventBus";

export class SimpleCluster extends EventBus implements Cluster {
    private members: Set<EventListener>;

    constructor(private name: string) {
        super();
        this.members = new Set<EventListener>();
    }

    public getName(): string {
        return this.name;
    }

    public getMembers(): Set<EventListener> {
        return this.members;
    }

    public publishAll(...events: Event[]): void {
        events.forEach(event => {
            this.publish(event);
        });
    }

    public publish(event: Event): boolean {
        this.members.forEach(listener => {
            listener.on(event);
        });

        return true;
    }

    public subscribe(listener: EventListener): void {
        this.members.add(listener);
    }

    public unsubscribe(listener: EventListener): void {
        this.members.delete(listener);
    }
}
