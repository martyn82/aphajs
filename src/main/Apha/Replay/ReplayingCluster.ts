
import {EventStore} from "../EventStore/EventStore";
import {Cluster} from "../EventHandling/Cluster";
import {Event} from "../Message/Event";
import {EventListener} from "../EventHandling/EventListener";

export class ReplayingCluster implements Cluster {
    constructor(private delegate: Cluster, private eventStore: EventStore) {}

    public startReplay(): void {
        this.eventStore.getAggregateIds().forEach(aggregateId => {
            this.publishAll.apply(this, this.eventStore.getEventsForAggregate(aggregateId));
        });
    }

    public getName(): string {
        return this.delegate.getName();
    }

    public publishAll(...events: Event[]): void {
        this.delegate.publishAll.apply(this.delegate, events);
    }

    public getMembers(): Set<EventListener> {
        return this.delegate.getMembers();
    }

    public subscribe(listener: EventListener): void {
        this.delegate.subscribe(listener);
    }

    public unsubscribe(listener: EventListener): void {
        this.delegate.unsubscribe(listener);
    }
}
